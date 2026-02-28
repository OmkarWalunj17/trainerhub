package com.omkar.trainerhub.util;

import java.time.Year;

public class TrainerHubOTPTemplate {

    public static String otpHtml(String otp, int validMinutes) {
        int year = Year.now().getValue();

        return """
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>TrainerHub OTP</title>
        </head>

        <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
          <div style="max-width:560px;margin:0 auto;padding:24px;">

            <!-- Header -->
            <div style="padding:8px 2px 16px 2px;">
              <div style="font-size:18px;font-weight:700;color:#0f172a;">
                TrainerHub
              </div>
              <div style="font-size:12px;color:#64748b;margin-top:4px;">
                Secure sign-in verification
              </div>
            </div>

            <!-- Card -->
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:22px;">
              <div style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px;">
                Your One-Time Password (OTP)
              </div>

              <div style="font-size:13px;line-height:1.6;color:#374151;margin-bottom:16px;">
                Use the OTP below to complete your login. This code is valid for <b>%d minutes</b>.
              </div>

              <!-- OTP box -->
              <div style="text-align:center;margin:18px 0 16px 0;">
                <div style="display:inline-block;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;padding:14px 18px;">
                  <span style="font-size:28px;font-weight:800;letter-spacing:6px;color:#0f172a;">
                    %s
                  </span>
                </div>
              </div>

              <div style="font-size:13px;line-height:1.6;color:#374151;">
                If you did not request this OTP, please ignore this email.
              </div>

              <div style="font-size:12px;line-height:1.6;color:#6b7280;margin-top:10px;">
                For your security, do not share this OTP with anyone.
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
        """.formatted(validMinutes, otp, year);
    }

    public static String otpText(String otp, int validMinutes) {
        return "TrainerHub OTP\n\n"
                + "Your OTP is: " + otp + "\n"
                + "Valid for: " + validMinutes + " minutes\n\n"
                + "If you did not request this OTP, ignore this email.\n"
                + "Do not share this OTP with anyone.";
    }
}
