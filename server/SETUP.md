# Backend Server Setup Guide

## Quick Setup Steps

### 1. Create `.env` file in the `server/` directory

Create a file named `.env` in the `server/` folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://gauravjena48_db_user:F86B3707gDhUZV84@cluster0.xcyvqwa.mongodb.net/?appName=Cluster0
JWT_SECRET=secretkey
NODE_ENV=development
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Start the Backend Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### 4. Verify the Server is Running

Open your browser or use curl to test:
```
http://localhost:5000/api/health
```

You should see: `{"status":"ok","message":"Server is running"}`

## Troubleshooting

### "Fetch Failed" Error

This usually means the backend server is not running. Make sure:

1. You're in the `server/` directory
2. The `.env` file exists with the correct MongoDB credentials
3. Dependencies are installed (`npm install`)
4. The server is running (`npm start`)

### MongoDB Connection Error

If you see MongoDB connection errors:

1. Check that your MongoDB URI is correct in `.env`
2. Verify your IP address is whitelisted in MongoDB Atlas (0.0.0.0/0 for development)
3. Ensure your database user has the correct permissions

### Port Already in Use

If port 5000 is already in use, either:
- Stop the other process using port 5000
- Change the PORT in `.env` to a different port (e.g., 5001)
- Update the frontend API URL in your Vite config

## Testing Registration

Once the server is running:

1. Go to `http://localhost:5173/register` (or your frontend URL)
2. Fill in the registration form
3. Submit
4. You should be redirected to `/dashboard`

If you see "Fetch failed", check the browser console (F12) for detailed error messages.
