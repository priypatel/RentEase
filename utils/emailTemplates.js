// utils/emailTemplates.js

export const passwordResetTemplate = (resetLink) => `
  <div style="font-family: Arial, sans-serif; background-color:#f8fafc; padding:20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; box-shadow:0 4px 8px rgba(0,0,0,0.05); padding:30px;">
      <h2 style="color:#2563eb; text-align:center;">Reset Your Password 🔐</h2>
      <p style="color:#374151; font-size:16px;">
        You recently requested to reset your password for your <strong>RentEase</strong> account.
      </p>
      <p style="color:#374151; font-size:16px;">Click the button below to set a new password:</p>
      
      <div style="text-align:center; margin:25px 0;">
        <a href="${resetLink}" 
           style="background-color:#2563eb; color:#fff; padding:12px 25px; text-decoration:none; border-radius:6px; display:inline-block;">
          Reset Password
        </a>
      </div>

      <p style="color:#6b7280; font-size:14px;">
        This link will expire in 15 minutes. If you didn’t request a password reset, you can safely ignore this email.
      </p>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;">
      <p style="text-align:center; color:#9ca3af; font-size:12px;">
        © ${new Date().getFullYear()} RentEase | Property Management & Rental Platform
      </p>
    </div>
  </div>
`;
