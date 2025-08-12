# Enhanced NextAuth.js + RTK Query Authentication System

This implementation provides a complete authentication system with JWT tokens, automatic refresh logic, and seamless integration between NextAuth.js Band RTK Query.

## 🚀 Features

- ✅ **NextAuth.js with Credentials Provider**
- ✅ **JWT Strategy with Access (1h) & Refresh (30d) Tokens**
- ✅ **Automatic Token Refresh Logic**
- ✅ **RTK Query Integration with Token Injection**
- ✅ **Secure Logout with Server-side Cleanup**
- ✅ **Redux Toolkit State Synchronization**
- ✅ **Protected Route Components**
- ✅ **TypeScript Support**

## 📁 Project Structure

```
src/
├── lib/
│   ├── auth.ts                 # NextAuth configuration with JWT handling
│   └── baseQueryWithReauth.ts  # RTK Query base query with auto-refresh
├── hooks/
│   └── useAuth.ts             # Authentication hooks
├── components/
│   ├── providers/
│   │   ├── SessionProvider.tsx # Enhanced session provider
│   │   └── AuthProvider.tsx   # NextAuth wrapper
│   ├── common/
│   │   ├── ProtectedRoute.tsx # Route guard component
│   │   └── LogoutButton.tsx   # Secure logout component
│   └── forms/
│       └── LoginForm.tsx      # Example login form
├── store/
│   ├── store.ts              # Redux store configuration
│   └── slices/
│       └── auth/
│           └── authSlice.ts  # Auth state management
├── services/
│   └── authApi.ts           # Auth API endpoints
└── app/
    └── api/
        └── auth/
            └── [...nextauth]/
                └── route.ts  # NextAuth API route
```

## 🔧 Core Components

### 1. NextAuth Configuration (`src/lib/auth.ts`)

```typescript
// Features:
- JWT token decoding and validation
- Automatic token refresh in JWT callback
- Session management with token storage
- Server-side logout handling
- Token expiration checking with 5-minute buffer
```

### 2. RTK Query Integration (`src/lib/baseQueryWithReauth.ts`)

```typescript
// Features:
- Automatic token injection into headers
- 401/403 error detection and handling
- Queue management for concurrent requests
- Seamless token refresh without user interruption
- Automatic logout on refresh failure
```

### 3. Redux Auth Slice (`src/store/slices/auth/authSlice.ts`)

```typescript
// Features:
- Authentication state management
- User information storage
- Token metadata tracking
- Loading and error states
- Hydration management
```

### 4. Authentication Hooks (`src/hooks/useAuth.ts`)

```typescript
// Available hooks:
- useAuth()          # Main auth hook
- useAuthStatus()    # Status checking
- useRequireAuth()   # Protected route logic
- useTokenManager()  # Token management
- useAutoRefresh()   # Automatic refresh
```

## 🛠️ Usage Examples

### Basic Authentication

```tsx
import { useAuth } from "@/hooks/useAuth";

function LoginPage() {
  const { login, logout, isAuthenticated, isLoading, user } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      // Redirect to dashboard
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          Welcome {user?.name}!<button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

function Dashboard() {
  return (
    <ProtectedRoute redirectUrl="/login">
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  );
}

// Or using HOC
export default withProtectedRoute(Dashboard, {
  redirectUrl: "/login",
});
```

### RTK Query with Authentication

```tsx
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/baseQueryWithReauth";

export const protectedApi = createApi({
  reducerPath: "protectedApi",
  baseQuery: baseQueryWithReauth, // Automatically handles tokens
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/user/profile", // Token automatically injected
    }),
  }),
});
```

### Session Provider Setup

```tsx
// app/layout.tsx
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <StoreProvider>{children}</StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
```

## 🔐 Token Flow

### 1. Login Process

```
User Login → Backend Auth → JWT Tokens → NextAuth Session → Redux State
```

### 2. API Request Flow

```
API Call → Check Token → Inject Header → Make Request
    ↓
401 Error → Refresh Token → Retry Request → Success/Failure
```

### 3. Automatic Refresh

```
JWT Callback → Check Expiry → Refresh if Needed → Update Session
```

### 4. Logout Process

```
User Logout → Clear Redux → Server Logout → Clear Session → Redirect
```

## ⚙️ Configuration

### Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8080/api
```

### Backend API Endpoints

Your backend should provide:

```
POST /auth/login       # Login with credentials
POST /auth/refresh     # Refresh access token
POST /auth/logout      # Server-side logout
POST /auth/register    # User registration
```

### Expected Response Format

```json
// Login Response
{
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

// Refresh Response
{
  "data": {
    "accessToken": "new_token_here",
    "refreshToken": "optional_new_refresh_token"
  }
}
```

## 🎯 Key Benefits

1. **Seamless UX**: Users don't experience interruptions during token refresh
2. **Security**: Tokens are securely managed and automatically refreshed
3. **Performance**: Request queuing prevents multiple refresh attempts
4. **Developer Experience**: Simple hooks and components for easy integration
5. **Type Safety**: Full TypeScript support throughout
6. **Scalability**: Easily extensible for additional auth providers

## 🔍 Troubleshooting

### Common Issues

1. **Token Refresh Loops**: Check JWT expiration time formatting
2. **401 Errors**: Verify backend token validation
3. **Session Not Persisting**: Check NEXTAUTH_SECRET configuration
4. **Redux State Sync**: Ensure SessionProvider wraps StoreProvider

### Debug Mode

Enable debug mode in development:

```typescript
// src/lib/auth.ts
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  // ...
};
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

This implementation provides a production-ready authentication system that handles all the complexities of JWT token management while providing a smooth developer and user experience.
