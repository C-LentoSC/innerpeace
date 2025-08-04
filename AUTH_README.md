# InnerPeace - Authentication System

## Overview

This project implements a complete authentication system using NextAuth.js v5 with credentials-based authentication, Prisma ORM, and role-based access control.

## Features

✅ **User Registration & Login**

- Email/password authentication
- Form validation with Zod
- Password hashing with bcrypt
- Error handling and user feedback

✅ **Role-Based Access Control**

- USER - Basic user privileges
- ADMIN - Administrative privileges
- SUPERADMIN - Full system access

✅ **Database Integration**

- MySQL database with Prisma ORM
- User profiles with extended fields
- Secure password storage

✅ **Session Management**

- JWT-based sessions
- Automatic session refresh
- Secure sign out

✅ **Protected Routes**

- Middleware-based route protection
- Automatic redirects for unauthenticated users
- Dashboard for authenticated users

## Default User Accounts

The system comes with two pre-seeded accounts:

### Super Admin Account

- **Email:** `superadmin@innerpeace.com`
- **Password:** `superadmin123`
- **Role:** SUPERADMIN

### Normal User Account

- **Email:** `user@innerpeace.com`
- **Password:** `user123456`
- **Role:** USER

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set up Database**

   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npm run db:seed
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Test Authentication**
   - Visit `http://localhost:3000`
   - Click "Sign In" and use one of the default accounts
   - Try accessing `/dashboard` (requires authentication)

## API Routes

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)
- `POST /api/auth/signout` - User logout (handled by NextAuth)

### Session

- `GET /api/auth/session` - Get current session (handled by NextAuth)

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── signin/page.tsx          # Sign in page
│   │   └── signup/page.tsx          # Sign up page
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts   # NextAuth route handler
│   │   └── signup/route.ts          # Registration API
│   └── dashboard/page.tsx           # Protected dashboard
├── components/
│   ├── AuthProvider.tsx             # Session provider wrapper
│   ├── UserNav.tsx                  # User navigation component
│   └── SignOutButton.tsx            # Sign out button
├── lib/
│   ├── password.ts                  # Password hashing utilities
│   └── validations.ts               # Zod validation schemas
├── types/
│   └── next-auth.d.ts               # NextAuth type extensions
├── auth.ts                          # NextAuth configuration
├── middleware.ts                    # Route protection middleware
└── prisma.ts                        # Prisma client setup
```

## Environment Variables

Required environment variables in `.env`:

```env
AUTH_SECRET="your-auth-secret"
DATABASE_URL="mysql://user:password@localhost:3306/database"
```

## Usage Examples

### Protecting a Page

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return <div>Protected content</div>;
}
```

### Using Session in Client Components

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user.firstName}!</div>;
}
```

### Role-Based Access

```typescript
// Check user role
if (session.user.role === "SUPERADMIN") {
  // Super admin only functionality
}
```

## Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ CSRF protection (built into NextAuth)
- ✅ Secure session cookies
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting ready (can be added to middleware)

## Technologies Used

- **Next.js 15** - React framework
- **NextAuth.js v5** - Authentication
- **Prisma** - Database ORM
- **MySQL** - Database
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Validation
- **bcryptjs** - Password hashing

## Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma migrate dev  # Run database migrations
npx prisma studio      # Open Prisma Studio
npm run db:seed        # Seed database with default users

# Code Quality
npm run lint           # Run ESLint
```

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Update documentation
5. Test authentication flows

## Troubleshooting

### Common Issues

**"Invalid credentials" error:**

- Check if user exists in database
- Verify password is correct
- Ensure database connection is working

**Middleware not working:**

- Check `config.matcher` in middleware.ts
- Verify auth.ts configuration
- Ensure session strategy is set correctly

**Database connection issues:**

- Verify DATABASE_URL in .env
- Check MySQL server is running
- Run migrations: `npx prisma migrate dev`

---

Built with ❤️ for InnerPeace
