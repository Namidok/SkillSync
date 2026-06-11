"""
SkillSync — Follow-up Email Reminder
Runs twice daily: 9am and 7pm
Scans all sessions and sends due follow-up alerts via Gmail
"""
import os
import json
import smtplib
import schedule
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date
from dotenv import load_dotenv

load_dotenv()

GMAIL_ADDRESS    = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
REMINDER_EMAIL   = os.getenv("REMINDER_EMAIL")
SESSIONS_DIR     = "data/sessions"


def get_due_followups():
    """Scan all session files and collect due follow-ups."""
    today = date.today()
    due = []

    if not os.path.exists(SESSIONS_DIR):
        return due

    for filename in os.listdir(SESSIONS_DIR):
        if not filename.endswith(".json"):
            continue
        filepath = os.path.join(SESSIONS_DIR, filename)
        try:
            with open(filepath, "r") as f:
                applications = json.load(f)
            for a in applications:
                if not a.get("follow_up_date"):
                    continue
                if a.get("status") in ("Offer", "Rejected"):
                    continue
                follow_up = date.fromisoformat(a["follow_up_date"])
                if follow_up <= today:
                    due.append(a)
        except Exception:
            continue

    return due


def build_email_html(due_apps):
    """Build a clean HTML email."""
    rows = ""
    for a in due_apps:
        rows += f"""
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #2d3748;">
            <strong style="color:#f7fafc;">{a['company']}</strong><br/>
            <span style="color:#a0aec0;font-size:12px;">{a['role']} · {a['city']}</span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #2d3748;">
            <span style="color:#a0aec0;font-size:13px;">{a.get('status','Not Applied')}</span>
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #2d3748;">
            <span style="color:#f6ad55;font-size:13px;">Due {a['follow_up_date']}</span>
          </td>
        </tr>
        """

    return f"""
    <html>
    <body style="background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:32px;">
      <div style="max-width:600px;margin:0 auto;">

        <div style="margin-bottom:24px;">
          <span style="color:#3B82F6;font-size:20px;font-weight:700;">⚡ SkillSync</span>
          <p style="color:#a0aec0;font-size:13px;margin-top:4px;">
            Follow-up reminder · {date.today().strftime('%d %B %Y')}
          </p>
        </div>

        <div style="background:#1a1d27;border:1px solid #2d3748;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          <div style="padding:16px 20px;border-bottom:1px solid #2d3748;">
            <p style="color:#f7fafc;font-size:15px;font-weight:600;margin:0;">
              {len(due_apps)} application{'s' if len(due_apps) != 1 else ''} need your attention
            </p>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#111318;">
                <th style="padding:10px 16px;text-align:left;color:#4a5568;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Company</th>
                <th style="padding:10px 16px;text-align:left;color:#4a5568;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Status</th>
                <th style="padding:10px 16px;text-align:left;color:#4a5568;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>

        <p style="color:#4a5568;font-size:12px;text-align:center;">
          SkillSync · 8-Week AI/ML Sprint 2026
        </p>

      </div>
    </body>
    </html>
    """


def send_reminder():
    """Check for due follow-ups and send email if any exist."""
    due_apps = get_due_followups()

    if not due_apps:
        print(f"[{date.today()}] No follow-ups due today. No email sent.")
        return

    print(f"[{date.today()}] Found {len(due_apps)} due follow-ups. Sending email...")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"⚡ SkillSync — {len(due_apps)} follow-up{'s' if len(due_apps) != 1 else ''} due today"
    msg["From"]    = GMAIL_ADDRESS
    msg["To"]      = REMINDER_EMAIL

    msg.attach(MIMEText(build_email_html(due_apps), "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_ADDRESS, REMINDER_EMAIL, msg.as_string())
        print(f"[{date.today()}] Email sent to {REMINDER_EMAIL}")
    except Exception as e:
        print(f"[{date.today()}] Failed to send email: {e}")


def main():
    print("⚡ SkillSync Reminder running...")
    print(f"   Sending to: {REMINDER_EMAIL}")
    print(f"   Schedule: 9:00am and 7:00pm daily")
    print()

    # Schedule twice daily
    schedule.every().day.at("09:00").do(send_reminder)
    schedule.every().day.at("19:00").do(send_reminder)

    # Also run once immediately on startup so you can test it
    send_reminder()

    while True:
        schedule.run_pending()
        time.sleep(60)


if __name__ == "__main__":
    main()