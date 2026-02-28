package com.omkar.trainerhub.util;

import java.time.Year;

public class TrainerHubEmailVerificationTemplate {

    /**
     * @param verifyUrl
     * @param validMinutes
     */
    public static String verificationHtml(String verifyUrl, int validMinutes) {
        int year = Year.now().getValue();

        return """
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>TrainerHub Email Verification</title>
        </head>

        <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
          <div style="max-width:560px;margin:0 auto;padding:24px;">

            <!-- Header -->
            <div style="padding:8px 2px 16px 2px;">
              <div style="font-size:18px;font-weight:700;color:#0f172a;">
                TrainerHub
              </div>
              <div style="font-size:12px;color:#64748b;margin-top:4px;">
                Email verification required
              </div>
            </div>

            <!-- Card -->
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:22px;">
              <div style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px;">
                Verify your email address
              </div>

              <div style="font-size:13px;line-height:1.6;color:#374151;margin-bottom:16px;">
                Thanks for signing up! Please verify your email to activate your account.
                This verification link is valid for <b>%d minutes</b>.
              </div>

              <!-- CTA Button -->
              <div style="text-align:center;margin:18px 0 14px 0;">
                <a href="%s"
                   style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;
                          padding:12px 18px;border-radius:10px;font-size:14px;font-weight:700;">
                  Verify Email
                </a>
              </div>

              <div style="font-size:12px;line-height:1.6;color:#6b7280;margin-top:8px;">
                If the button doesn’t work, copy and paste this link into your browser:
              </div>

              <!-- Link box -->
              <div style="margin-top:10px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;padding:12px;">
                <div style="font-size:12px;line-height:1.5;color:#0f172a;word-break:break-all;">
                  %s
                </div>
              </div>

              <div style="font-size:13px;line-height:1.6;color:#374151;margin-top:16px;">
                If you did not create an account, please ignore this email.
              </div>

              <div style="font-size:12px;line-height:1.6;color:#6b7280;margin-top:10px;">
                For your security, do not forward this email or share the verification link.
              </div>

              <!-- subtle divider -->
              <div style="height:1px;background:#eef2f7;margin:18px 0;"></div>

              <div style="font-size:12px;color:#64748b;line-height:1.6;">
                Having trouble? Contact your TrainerConnect administrator.
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align:center;font-size:11px;color:#94a3b8;margin-top:14px;line-height:1.6;">
              © %d TrainerHub. All rights reserved.
            </div>

          </div>
        </body>
        </html>
        """.formatted(validMinutes, verifyUrl, verifyUrl, year);
    }
    
    public static String verificationText(String verifyUrl, int validMinutes) {
        return "TrainerHub Email Verification\n\n"
                + "Please verify your email to activate your account.\n"
                + "This link is valid for: " + validMinutes + " minutes\n\n"
                + "Verification link:\n"
                + verifyUrl + "\n\n"
                + "If you did not create an account, ignore this email.\n"
                + "For your security, do not share this link.";
    }
}