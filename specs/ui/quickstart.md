# Quickstart Guide: Frontend UI Development

## Prerequisites
- Node.js 18+ installed
- Access to the backend API (running on http://localhost:8000)
- Better Auth configured with proper secrets

## Setup Instructions

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   BETTER_AUTH_SECRET=your-secret-key-here
   ```

4. **Configure Tailwind CSS**:
   - Update `tailwind.config.ts` with the custom color palette as specified in the design system:
     - Primary: Indigo-600
     - Background: Slate-50 (App background), White (Cards)
     - Text: Slate-900 (Headings), Slate-600 (Body)
     - Status: Green-500 (Completed), Amber-500 (Pending), Red-500 (Delete/Error)

## Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   Open your browser to `http://localhost:3000` to see the application running.

## Key Components and Files

### Authentication
- Login page: `src/app/login/page.tsx`
- Auth client: `src/lib/auth-client.ts`
- The login form uses Better Auth hooks for authentication

### Dashboard and Task Management
- Dashboard page: `src/app/dashboard/page.tsx`
- Task Card: `src/components/TaskCard/TaskCard.tsx`
- Task Form (Modal): `src/components/TaskForm/TaskForm.tsx`
- Sidebar: `src/components/Sidebar/Sidebar.tsx`

### API Integration
- API client: `src/lib/api.ts` (includes JWT token attachment)

### Styling
- Global styles: `src/styles/globals.css`
- Tailwind config: `tailwind.config.ts`

## Making API Requests

The application uses the API client in `src/lib/api.ts` which automatically:
- Attaches the JWT token from Better Auth to each request
- Handles common error responses
- Implements request/response interceptors

To add a new task:
```javascript
import apiClient from '@/lib/api';

const newTask = await apiClient.post(`/api/${userId}/tasks`, {
  title: "New task",
  description: "Task description"
});
```

## Development Workflow

1. Create new components in the `src/components` directory
2. Add pages to the `src/app` directory following the App Router structure
3. Use Tailwind CSS classes following the design system specifications
4. Implement API calls using the centralized API client
5. Add tests in the `tests/` directory