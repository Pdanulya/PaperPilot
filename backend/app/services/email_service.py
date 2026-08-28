import os
import smtplib

from email.message import EmailMessage


def send_document_share_email(
    recipient_email: str,
    document_title: str,
    share_url: str
):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from_email = os.getenv("SMTP_FROM_EMAIL")

    message = EmailMessage()

    message["Subject"] = f"PaperPilot - {document_title} was shared with you"
    message["From"] = smtp_from_email
    message["To"] = recipient_email

    message.set_content(
        f"""
Someone shared a document with you through PaperPilot.

Document:
{document_title}

You have been given view-only access to this document.

You do not need a PaperPilot account to view it.

View the document:
{share_url}

This link provides access only to the shared document and its generated summary.

— PaperPilot
"""
    )

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)