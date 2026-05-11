// forgotPasswordTemplate.js

export const forgotPasswordTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset OTP</title>
    </head>

    <body
      style="
        margin: 0;
        padding: 0;
        background-color: #f4f7fb;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="padding: 40px 0; background-color: #f4f7fb"
      >
        <tr>
          <td align="center">
            <table
              width="600"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
              "
            >
              <!-- Header -->
              <tr>
                <td
                  align="center"
                  style="
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    padding: 32px;
                    color: white;
                  "
                >
                  <h1 style="margin: 0; font-size: 28px">
                    Password Reset Request
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px; color: #333333">
                  <p style="font-size: 16px; margin-top: 0">
                    Hello,
                  </p>

                  <p style="font-size: 16px; line-height: 1.7">
                    We received a request to reset your password.
                    Use the verification code below to continue.
                  </p>

                  <!-- OTP Box -->
                  <div
                    style="
                      margin: 32px auto;
                      text-align: center;
                    "
                  >
                    <div
                      style="
                        display: inline-block;
                        background-color: #f3f4f6;
                        padding: 18px 36px;
                        border-radius: 12px;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: #2563eb;
                      "
                    >
                      ${otp}
                    </div>
                  </div>

                  <p
                    style="
                      font-size: 14px;
                      line-height: 1.7;
                      color: #666666;
                    "
                  >
                    This OTP will expire in
                    <strong>15 minutes</strong>.
                  </p>

                  <p
                    style="
                      font-size: 14px;
                      line-height: 1.7;
                      color: #666666;
                    "
                  >
                    If you did not request a password reset,
                    you can safely ignore this email.
                  </p>

                  <hr
                    style="
                      border: none;
                      border-top: 1px solid #e5e7eb;
                      margin: 32px 0;
                    "
                  />

                  <p
                    style="
                      font-size: 13px;
                      color: #999999;
                      line-height: 1.6;
                      text-align: center;
                    "
                  >
                    For security reasons, do not share this OTP with anyone.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  align="center"
                  style="
                    background-color: #f9fafb;
                    padding: 24px;
                    font-size: 13px;
                    color: #9ca3af;
                  "
                >
                  © 2026 Your Company. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};