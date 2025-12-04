# Quick Start Guide - Backend-Frontend Integration

## Prerequisites

- Go 1.21+ installed
- Node.js 18+ installed
- Backend and frontend dependencies installed

## Step 1: Start the Backend

```bash
cd backend
go run cmd/server/main.go
```

The backend will start on `http://localhost:8080`

**Verify it's running:**
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "trae-nutrition-backend",
  "timestamp": "2024-..."
}
```

## Step 2: Start the Frontend

```bash
cd frontend
npm install  # If not already done
npm run dev
```

The frontend will start on `http://localhost:3000`

## Step 3: Verify Integration

### Option 1: Run Integration Test Script

```bash
./scripts/test-integration.sh
```

This will test:
- ✅ Backend health endpoint
- ✅ API status endpoint
- ✅ CORS configuration
- ✅ All API endpoints
- ✅ Frontend accessibility

### Option 2: Use the Web UI Test Page

1. Navigate to `http://localhost:3000/api-test`
2. Click "Run Tests" button
3. Review the test results

### Option 3: Check API Status Indicator

- Look at the navigation bar in the frontend
- You should see "API Connected" with a green checkmark
- If it shows "API Offline", check:
  - Backend is running
  - `NEXT_PUBLIC_API_URL` in frontend `.env` matches backend URL

## Step 4: Test the Application

1. **Login/Register**
   - Go to `http://localhost:3000/login`
   - Use any credentials (backend currently accepts all)
   - You'll be redirected to dashboard

2. **Dashboard**
   - View overview of meals, workouts, and progress
   - Data is fetched from backend API

3. **Meals Page**
   - View meals
   - Add new meals
   - Create meal plans

4. **Workouts Page**
   - View workouts
   - Add new workouts
   - View workout plans

5. **Progress Page**
   - View weight progress chart
   - Log weight and measurements

## Troubleshooting

### Backend Not Starting

```bash
# Check if port 8080 is already in use
lsof -i :8080

# Or use a different port
export PORT=8081
go run cmd/server/main.go
```

Then update frontend `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### CORS Errors

If you see CORS errors in browser console:

1. Verify backend CORS config in `backend/cmd/server/main.go`
2. Make sure frontend URL is in allowed origins
3. Check backend logs for CORS-related errors

### API Calls Failing

1. Open browser DevTools → Network tab
2. Check if requests are being made
3. Look at response status codes
4. Check browser console for error messages
5. Verify `NEXT_PUBLIC_API_URL` in frontend `.env`

### Data Not Loading

1. Check browser console for errors
2. Verify backend is returning data:
   ```bash
   curl http://localhost:8080/api/v1/meals
   ```
3. Check Network tab in DevTools
4. Verify authentication token exists in localStorage

## Environment Variables

### Frontend (`frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (`backend/.env` or environment)
```env
PORT=8080
ENVIRONMENT=development
```

## Development Tips

1. **API Logging**: In development, all API calls are logged to browser console
2. **Error Handling**: Errors are automatically handled and displayed
3. **Hot Reload**: Both frontend and backend support hot reload during development
4. **Type Safety**: TypeScript ensures type safety between frontend and backend

## Next Steps

- Implement real authentication with JWT validation
- Add database persistence
- Implement request validation
- Add error response standardization
- Set up CI/CD for automated testing
