export const OtpTemplate = ({ otp, username }) => {
  return `
    <!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Security Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #111827;
    }
    .wrapper {
      width: 100%;
      padding: 40px 16px;
    }
    .email {
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .header {
      padding: 24px 32px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 18px;
      font-weight: 600;
    }
    .content {
      padding: 32px;
      font-size: 15px;
      line-height: 1.7;
    }
    .otp-container {
      margin: 32px 0;
      text-align: center;
    }
    .otp {
      display: inline-block;
      padding: 14px 28px;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 8px;
      border: 1px dashed #9ca3af;
      border-radius: 6px;
      color: #000000;
      background-color: #fafafa;
    }
    .note {
      margin-top: 24px;
      font-size: 14px;
      color: #374151;
    }
    .security {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
    }
    .footer {
      padding: 20px 32px;
      font-size: 12px;
      color: #6b7280;
      background-color: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="email">
      <div class="header">
        Email Verification Required
      </div>


  <div class="content">
    <p>Hello, ${username}</p>

    <p>
      A request was received to verify access to your account.
      Please use the verification code below to continue.
    </p>

    <div class="otp-container">
      <div class="otp">${otp}</div>
    </div>

    <p class="note">
      This code will expire in <strong>10 minutes</strong>.
      For your protection, do not share this code with anyone.
    </p>

    <div class="security">
      If you did not initiate this request, you can safely ignore this email.
      No changes will be made to your account.
    </div>
  </div>

  <div class="footer">
    © {{YEAR}} Your Company Name. All rights reserved.<br/>
    This is an automated message. Please do not reply.
  </div>
</div>


  </div>
</body>
</html>
`;
};
