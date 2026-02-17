# Contact Form Backend

A lightweight FastAPI backend that receives contact form submissions and sends them to your email via Gmail SMTP.

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Make sure **2-Step Verification** is turned ON
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **App** = "Mail" and **Device** = "Other (Custom name)"
5. Name it "Portfolio" and click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Create Your `.env` File

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
SMTP_EMAIL=youremail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
RECIPIENT_EMAIL=youremail@gmail.com
```

### 4. Run the Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Test it: open `http://localhost:8000/` — you should see `{"status": "ok"}`.

### 5. Run Both Frontend + Backend

**Terminal 1 — Frontend:**
```bash
npm run dev
```

**Terminal 2 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

## API Reference

### `POST /contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello! I'd like to collaborate."
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Your message has been sent! I'll get back to you soon."
}
```

**Error Responses:**
- `422` — Invalid input (missing/bad fields)
- `429` — Rate limited (max 5 requests per 15 min per IP)
- `500` — SMTP error

## Deployment

### Render (Free Tier)

1. Push your `backend/` folder to a Git repo
2. Go to [render.com](https://render.com) → New → **Web Service**
3. Connect your repo, set root directory to `backend`
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `SMTP_EMAIL`, `SMTP_PASSWORD`, `RECIPIENT_EMAIL`
6. Deploy!

### Railway

1. Go to [railway.app](https://railway.app) → New Project → **Deploy from GitHub**
2. Set root directory to `backend`
3. Railway auto-detects Python — add a `Procfile`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Add environment variables in the Railway dashboard
5. Deploy!

> **Important:** After deploying, update the `BACKEND_URL` in your frontend `main.js` to point to your deployed backend URL (e.g., `https://your-app.onrender.com`).
