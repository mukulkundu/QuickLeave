import { supabase } from "./supabaseClient";

export async function signInWithGoogle() {
    console.log('🔄 Starting Google sign-in...');
    console.log('🌐 Current origin:', window.location.origin);
    console.log(`🔗 Redirect URL will be:, ${window.location.origin}/auth/callback`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                prompt: 'consent' // Forces Google to show account selection
            }
        },
    });
    
    if (error) {
        console.error("❌ Google sign-in error:", error.message);
        return null;
    }
    
    console.log("✅ OAuth initiated successfully:", data);
    return data;
}

export async function signOut() {
    console.log('🔄 Starting sign out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("❌ Sign-out error:", error.message);
    } else {
        console.log("✅ Successfully signed out");
    }
}