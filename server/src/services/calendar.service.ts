import { google } from 'googleapis';
import { supabase } from '../config/supabaseClient';

// Google Calendar API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

interface CalendarEventData {
  userId: string;
  leaveRequestId?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  userEmail: string;
  userName?: string;
}

/**
 * Add leave event to user's Google Calendar
 */
export async function addLeaveToCalendar(data: CalendarEventData): Promise<void> {
  try {
    const { data: userTokens, error } = await supabase
      .from('user_calendar_tokens')
      .select('access_token, refresh_token, expiry_date')
      .eq('user_id', data.userId)
      .single();

    if (error || !userTokens) {
      // console.log(`📅 No calendar tokens for user ${data.userId}, skipping calendar event`);
      return;
    }

    // Check expiry and refresh if needed
    if (userTokens.expiry_date && Date.now() >= userTokens.expiry_date) {
      // console.log("⚠️ Access token expired, refreshing...");
      await refreshUserTokens(data.userId);
    }

    oauth2Client.setCredentials({
      access_token: userTokens.access_token,
      refresh_token: userTokens.refresh_token,
      expiry_date: userTokens.expiry_date,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: `${data.leaveType} Leave`,
      description: `Leave Request: ${data.reason}\n\nStatus: Approved`,
      start: { date: data.startDate, timeZone: 'UTC' },
      end: { date: getNextDay(data.endDate), timeZone: 'UTC' }, // end date is exclusive
      attendees: [{ email: data.userEmail, displayName: data.userName }],
      colorId: '10', // green
      transparency: 'transparent',
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    const googleEventId = response.data.id;
    // console.log(`📅 Calendar event created: ${response.data.htmlLink}`);

    if (data.leaveRequestId) {
      // update leave_requests
      await supabase.from('leave_requests')
        .update({ google_event_id: googleEventId })
        .eq('id', data.leaveRequestId);

      // insert into leave_calendar_events
      await supabase.from('leave_calendar_events').insert({
        leave_request_id: data.leaveRequestId,
        google_event_id: googleEventId,
        user_id: data.userId,
        created_at: new Date().toISOString(),
      });
    }

  } catch (error: any) {
    console.error('❌ Error adding to calendar:', error.message);

    if (error.code === 401 || error.message.includes("Invalid Credentials")) {
      // console.log("🔄 Refreshing tokens due to 401...");
      await refreshUserTokens(data.userId);
    }
  }
}

/**
 * Update existing calendar event
 */
export async function updateLeaveInCalendar(data: CalendarEventData & { googleEventId: string }) {
  try {
    const { data: token } = await supabase
      .from('user_calendar_tokens')
      .select('*')
      .eq('user_id', data.userId)
      .maybeSingle();

    if (!token) return;

    if (token.expiry_date && Date.now() >= token.expiry_date) {
      // console.log("⚠️ Access token expired, refreshing...");
      await refreshUserTokens(data.userId);
    }

    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: `${data.leaveType} Leave (Updated)`,
      description: `Leave Request Updated: ${data.reason}\n\nStatus: Approved`,
      start: { date: data.startDate, timeZone: 'UTC' },
      end: { date: getNextDay(data.endDate), timeZone: 'UTC' },
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: data.googleEventId,
      requestBody: event,
    });

    // console.log(`📅 Calendar event updated: ${data.googleEventId}`);
  } catch (err: any) {
    console.error('❌ Error updating calendar event:', err.message);
  }
}

/**
 * Delete leave from calendar
 */
export async function deleteLeaveFromCalendar(userId: string, googleEventId: string) {
  try {
    const { data: token } = await supabase
      .from('user_calendar_tokens')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!token) return;

    if (token.expiry_date && Date.now() >= token.expiry_date) {
      // console.log("⚠️ Access token expired, refreshing...");
      await refreshUserTokens(userId);
    }

    oauth2Client.setCredentials(token);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });

    // console.log(`🗑️ Calendar event deleted: ${googleEventId}`);
  } catch (err: any) {
    console.error('❌ Error deleting calendar event:', err.message);
  }
}

/**
 * Refresh user's Google Calendar tokens
 */
async function refreshUserTokens(userId: string): Promise<void> {
  try {
    const { data: tokens } = await supabase
      .from('user_calendar_tokens')
      .select('refresh_token')
      .eq('user_id', userId)
      .maybeSingle();

    if (!tokens?.refresh_token) {
      console.error('No refresh token available');
      return;
    }

    oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
    const newTokens = await oauth2Client.refreshAccessToken();
    const credentials = newTokens.credentials;

    if (!credentials.access_token) {
      console.error("❌ Failed to refresh token");
      return;
    }

    await supabase.from('user_calendar_tokens')
      .update({
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    // console.log('🔄 Tokens refreshed successfully');
  } catch (error) {
    console.error('❌ Error refreshing tokens:', error);
  }
}

/**
 * Get authorization URL for Google Calendar
 */
export function getCalendarAuthUrl(userId: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
    state: userId,
    prompt: 'consent',
  });
}

/**
 * Handle OAuth callback and store tokens
 */
export async function handleCalendarCallback(code: string, userId: string): Promise<void> {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    await supabase.from('user_calendar_tokens').upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    // console.log(`📅 Calendar tokens stored for user ${userId}`);
  } catch (error) {
    console.error('❌ Error handling calendar callback:', error);
    throw error;
  }
}

/**
 * Check if user has connected their calendar
 */
export async function isCalendarConnected(userId: string) {
  const { data } = await supabase
    .from('user_calendar_tokens')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  return !!data;
}

/**
 * Disconnect user's calendar
 */
export async function disconnectCalendar(userId: string): Promise<void> {
  await supabase.from('user_calendar_tokens').delete().eq('user_id', userId);
}

/**
 * Remove leave request from Google Calendar and DB
 */
export async function removeLeaveFromCalendar({
  userId,
  leaveRequestId,
}: {
  userId: string;
  leaveRequestId: string;
}): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('leave_calendar_events')
      .select('google_event_id')
      .eq('leave_request_id', leaveRequestId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data?.google_event_id) {
      // console.log(`⚠️ No Google event found for leave ${leaveRequestId}`);
      return;
    }

    await deleteLeaveFromCalendar(userId, data.google_event_id);

    // cleanup DB
    await supabase
      .from('leave_calendar_events')
      .delete()
      .eq('leave_request_id', leaveRequestId)
      .eq('user_id', userId);

    await supabase
      .from('leave_requests')
      .update({ google_event_id: null })
      .eq('id', leaveRequestId);

    // console.log(`🗑️ Removed Google event for leave ${leaveRequestId}`);
  } catch (err: any) {
    console.error("❌ Error removing leave from calendar:", err.message);
  }
}

/**
 * Helper: Get next day for all-day events
 */
function getNextDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}
