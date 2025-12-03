# Backend-Frontend Integration Guide

This document outlines how the frontend and backend are integrated and how to verify the integration.

## Integration Points

### 1. API Base URL Configuration

**Frontend:** `frontend/src/lib/api.ts`
- Uses `NEXT_PUBLIC_API_URL` environment variable
- Defaults to `http://localhost:8080`
- Set in `.env` file: `NEXT_PUBLIC_API_URL=http://localhost:8080`

**Backend:** `backend/cmd/server/main.go`
- Runs on port 8080 by default (configurable via `PORT` env var)
- CORS configured to allow requests from `http://localhost:3000`

### 2. CORS Configuration

The backend has explicit CORS configuration to allow:
- Origins: `http://localhost:3000`, `http://localhost:3001`, `http://127.0.0.1:3000`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Origin, Content-Type, Accept, Authorization
- Credentials: Enabled

### 3. Authentication Flow

1. User logs in via `/api/v1/auth/login`
2. Backend returns JWT token in response
3. Frontend stores token in `localStorage`
4. Token is automatically added to all subsequent requests via Axios interceptor
5. On 401 errors, frontend redirects to login page

### 4. API Endpoints Mapping

| Frontend Function | Backend Endpoint | Method | Description |
|------------------|-----------------|--------|-------------|
| `healthAPI.check()` | `/health` | GET | Health check |
| `healthAPI.status()` | `/api/status` | GET | API status |
| `authAPI.login()` | `/api/v1/auth/login` | POST | User login |
| `authAPI.register()` | `/api/v1/auth/register` | POST | User registration |
| `authAPI.refresh()` | `/api/v1/auth/refresh` | POST | Refresh token |
| `userAPI.getProfile()` | `/api/v1/users/profile` | GET | Get user profile |
| `userAPI.updateProfile()` | `/api/v1/users/profile` | PUT | Update profile |
| `mealsAPI.getMeals()` | `/api/v1/meals` | GET | Get meals |
| `mealsAPI.createMeal()` | `/api/v1/meals` | POST | Create meal |
| `mealsAPI.getMealPlans()` | `/api/v1/meals/plans` | GET | Get meal plans |
| `mealsAPI.createMealPlan()` | `/api/v1/meals/plans` | POST | Create meal plan |
| `workoutsAPI.getWorkouts()` | `/api/v1/workouts` | GET | Get workouts |
| `workoutsAPI.createWorkout()` | `/api/v1/workouts` | POST | Create workout |
| `workoutsAPI.getWorkoutPlans()` | `/api/v1/workouts/plans` | GET | Get workout plans |
| `progressAPI.getWeightProgress()` | `/api/v1/progress/weight` | GET | Get weight progress |
| `progressAPI.logWeight()` | `/api/v1/progress/weight` | POST | Log weight |
| `progressAPI.getMeasurements()` | `/api/v1/progress/measurements` | GET | Get measurements |
| `progressAPI.logMeasurements()` | `/api/v1/progress/measurements` | POST | Log measurements |

## Verification Steps

### 1. Start Backend

```bash
cd backend
go run cmd/server/main.go
# Or use your preferred method
```

Backend should be running on `http://localhost:8080`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend should be running on `http://localhost:3000`

### 3. Check API Status

- Navigate to `http://localhost:3000/api-test` to run integration tests
- Check the API status indicator in the navigation bar
- Verify all endpoints return expected responses

### 4. Test Authentication Flow

1. Go to `/login`
2. Use any credentials (backend currently accepts any login)
3. Should redirect to `/dashboard` after successful login
4. Token should be stored in localStorage

### 5. Test Data Fetching

1. After logging in, navigate to different pages:
   - `/dashboard` - Should show meals, workouts, and progress
   - `/meals` - Should display meal list
   - `/workouts` - Should display workout list
   - `/progress` - Should show progress charts

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Verify backend CORS configuration includes your frontend URL
2. Check that backend is running
3. Ensure frontend is using correct API URL

### 401 Unauthorized Errors

1. Check if token exists in localStorage
2. Verify token format (should be JWT)
3. Check backend authentication middleware
4. Try logging in again

### Network Errors

1. Verify backend is running on port 8080
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env`
3. Check browser console for detailed error messages
4. Verify firewall/network settings

### Data Not Loading

1. Check browser Network tab to see API requests
2. Verify API responses match expected format
3. Check browser console for errors
4. Run integration tests at `/api-test`

## Development Tips

1. **API Logging**: In development mode, all API requests/responses are logged to console
2. **Error Handling**: All API errors are caught and displayed to users
3. **Type Safety**: TypeScript types ensure data structure consistency
4. **Response Validation**: Use validators in `api-validator.ts` to verify responses

## Environment Variables

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend (.env)
```
PORT=8080
ENVIRONMENT=development
DATABASE_URL=...
REDIS_URL=...
JWT_SECRET=...
```

## Next Steps

1. Implement actual JWT validation in backend
2. Add request body validation
3. Implement database persistence
4. Add error response standardization
5. Implement rate limiting per user
6. Add API versioning strategy
