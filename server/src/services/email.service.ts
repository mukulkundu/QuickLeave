import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // true only for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface LeaveEmailData {
  email: string;
  name?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "approved" | "rejected" | "cancelled";
}

export async function sendLeaveStatusEmail(data: LeaveEmailData) {
  const isCancellation = data.status === "cancelled";
  const subject = isCancellation
    ? "Leave Cancelled"
    : `Leave Request ${data.status.toUpperCase()}`;
  const text = isCancellation
    ? `Hi ${data.name || "Employee"},

Your leave is cancelled.

Regards,
Leave Management System`
    : `Hi ${data.name || "Employee"},

Your ${data.leaveType} leave request from ${data.startDate} to ${data.endDate} has been ${data.status}.

Regards,
Leave Management System`;

  const html = isCancellation
    ? `
    <p>Hi <b>${data.name || "Employee"}</b>,</p>
    <p>Your leave is <b>cancelled</b> successfully.</p>
    <p>Regards,<br/>Leave Management System</p>
  `
    : `
    <p>Hi <b>${data.name || "Employee"}</b>,</p>
    <p>Your <b>${data.leaveType}</b> leave request from 
    <b>${data.startDate}</b> to <b>${data.endDate}</b> 
    has been <span style="color:${data.status === "approved" ? "green" : "red"}">
    ${data.status.toUpperCase()}</span>.</p>
    <p>Regards,<br/>Leave Management System</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: data.email,
      subject,
      text,
      html,
    });
    // console.log(`📧 Email sent to ${data.email} (${data.status})`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}
