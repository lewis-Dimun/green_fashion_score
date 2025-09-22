# Test Users Guide

## Quick Setup

After setting up your database, you can create test users using the seed script:

```bash
npm run db:seed
```

## Manual User Creation

If you prefer to create users manually or the seed script doesn't work, you can create users through the application:

### Method 1: Using the Sign-up Page
1. Go to `http://localhost:3000/auth/signup`
2. Fill out the registration form
3. Use any email and password combination

### Method 2: Using Prisma Studio
1. Run `npm run db:studio`
2. Open the User table
3. Click "Add record"
4. Fill in the required fields:
   - `name`: Test User
   - `email`: test@example.com
   - `role`: USER (or ADMIN)
   - `emailVerified`: Set to current date

## Test Accounts (After Seeding)

### Regular User
- **Email**: `test@example.com`
- **Password**: Any password (demo mode)
- **Role**: USER
- **Access**: Dashboard, Charts

### Admin User
- **Email**: `admin@example.com`
- **Password**: Any password (demo mode)
- **Role**: ADMIN
- **Access**: Full access to all features

## Demo Mode Notes

⚠️ **Important**: This application is in demo mode, which means:
- Any password will work for authentication
- No actual password verification is performed
- This is for testing purposes only

## Production Considerations

For production use, you should:
1. Implement proper password hashing
2. Add email verification
3. Add password strength requirements
4. Implement proper session management
5. Add rate limiting for login attempts

## Sample Data

The seed script also creates sample fashion scores:
- Nike: 85.5/100 (Sportswear)
- H&M: 72.0/100 (Fast Fashion)
- Patagonia: 95.0/100 (Outdoor)

These will appear in your charts and dashboard once you're logged in.

