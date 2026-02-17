"""
==============================================
FASTAPI CONTACT FORM BACKEND
==============================================
Receives form submissions, validates input,
rate-limits requests, and sends emails via
Gmail SMTP using an App Password.
==============================================
"""

import os
import re
import time
import smtplib
import logging
from email.message import EmailMessage
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv

# ------------------------------------------
# 1. LOAD ENVIRONMENT VARIABLES
# ------------------------------------------
# Reads .env file in the same directory
load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")         # Your Gmail address
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")   # Gmail App Password (NOT your regular password)
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", SMTP_EMAIL)  # Where to receive messages (defaults to SMTP_EMAIL)

# Validate that credentials are set
if not SMTP_EMAIL or not SMTP_PASSWORD:
    logging.warning(
        "⚠️  SMTP_EMAIL and SMTP_PASSWORD are not set. "
        "Email sending will fail. Check your .env file."
    )

# ------------------------------------------
# 2. FASTAPI APP SETUP
# ------------------------------------------
app = FastAPI(
    title="Hurman Portfolio — Contact API",
    description="Handles contact form submissions and sends emails via Gmail SMTP.",
    version="1.0.0",
)

# ------------------------------------------
# 3. CORS CONFIGURATION
# ------------------------------------------
# Allow your frontend to make requests to this backend.
# In production, replace "*" with your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Alternative dev port
        "http://127.0.0.1:5173",
        "*",                       # Remove in production; use your domain instead
    ],
    allow_credentials=True,
    allow_methods=["POST"],        # Only POST is needed
    allow_headers=["*"],
)

# ------------------------------------------
# 4. RATE LIMITING (Simple In-Memory)
# ------------------------------------------
# Tracks requests per IP address.
# Max 5 requests per 15 minutes per IP.
RATE_LIMIT_MAX = 5
RATE_LIMIT_WINDOW = 15 * 60  # 15 minutes in seconds
request_log: dict[str, list[float]] = defaultdict(list)


def is_rate_limited(ip: str) -> bool:
    """Check if an IP has exceeded the rate limit."""
    now = time.time()
    # Remove expired timestamps
    request_log[ip] = [t for t in request_log[ip] if now - t < RATE_LIMIT_WINDOW]
    # Check if limit exceeded
    if len(request_log[ip]) >= RATE_LIMIT_MAX:
        return True
    # Record this request
    request_log[ip].append(now)
    return False


# ------------------------------------------
# 5. REQUEST MODEL & VALIDATION
# ------------------------------------------
class ContactRequest(BaseModel):
    """
    Validates incoming contact form data.
    Pydantic automatically rejects missing/invalid fields.
    """
    name: str
    email: str
    message: str

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters.")
        if len(v) > 100:
            raise ValueError("Name must be under 100 characters.")
        return v

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        v = v.strip().lower()
        # Simple but effective email regex
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Please provide a valid email address.")
        return v

    @field_validator("message")
    @classmethod
    def message_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 10:
            raise ValueError("Message must be at least 10 characters.")
        if len(v) > 5000:
            raise ValueError("Message must be under 5000 characters.")
        return v


# ------------------------------------------
# 6. HEALTH CHECK ENDPOINT
# ------------------------------------------
@app.get("/")
async def health_check():
    """Simple health check to verify the API is running."""
    return {"status": "ok", "message": "Hurman Portfolio API is running."}


# ------------------------------------------
# 7. CONTACT FORM ENDPOINT
# ------------------------------------------
@app.post("/contact")
async def handle_contact(data: ContactRequest, request: Request):
    """
    Receives a contact form submission:
    1. Checks rate limit
    2. Validates input (handled by Pydantic)
    3. Sends email via Gmail SMTP
    4. Returns success/error response
    """

    # --- Rate Limiting ---
    client_ip = request.client.host if request.client else "unknown"
    if is_rate_limited(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a few minutes before trying again."
        )

    # --- Check SMTP credentials ---
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        raise HTTPException(
            status_code=500,
            detail="Email service is not configured. Please contact me directly."
        )

    # --- Build the Email ---
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio Contact: {data.name}"
    msg["From"] = SMTP_EMAIL
    msg["To"] = RECIPIENT_EMAIL
    msg["Reply-To"] = data.email  # So you can reply directly to the sender

    # Email body — clean and readable
    body = f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 New Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:    {data.name}
Email:   {data.email}

Message:
{data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent from your portfolio website.
    """.strip()

    msg.set_content(body)

    # --- Send via Gmail SMTP ---
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)

        return {
            "status": "success",
            "message": "Your message has been sent! I'll get back to you soon."
        }

    except smtplib.SMTPAuthenticationError:
        # Wrong email/password or App Password not set up
        raise HTTPException(
            status_code=500,
            detail="Email authentication failed. Please try again later."
        )
    except smtplib.SMTPException as e:
        # Any other SMTP error
        logging.error(f"SMTP error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send email. Please try again later."
        )
    except Exception as e:
        # Catch-all for unexpected errors
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Something went wrong. Please try again later."
        )
