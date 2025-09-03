# Hostizzy PMS - Property Management System

A comprehensive multi-role property management system built with Next.js 14, Supabase, and TypeScript.

## 🚀 Features

- **Multi-Role Authentication**: Admin, Owner, Manager, and Guest access levels
- **Property Management**: CRUD operations for properties with availability tracking
- **Reservation System**: Complete booking lifecycle with status management
- **Guest KYC**: ID collection system with 180-day auto-deletion
- **Meal Management**: Menu builder and guest meal selections
- **Review System**: Brand-level review collection and management
- **Analytics Dashboard**: Revenue, occupancy, ADR, and RevPAR reporting
- **CSV Import**: Bulk reservation import with validation
- **Real-time Updates**: Live availability and booking status
- **Role-based Security**: RLS-enforced data access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Authentication**: Supabase Auth with magic links
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Storage**: Supabase Storage for KYC documents
- **Deployment**: Render (web app) + Supabase (managed)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Render account (for deployment)

## 🏗️ Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Note down your project URL and anon key from Settings > API

### 2. Database Setup

1. Go to Supabase SQL Editor
2. Run the database schema from `hostizzy_schema.sql` (the first artifact)
3. Run the RLS policies from `hostizzy_rls.sql` (the second artifact)
4. Run the seed data from `hostizzy_seed.sql` (the third artifact)

### 3. Storage Setup

1. In Supabase Dashboard, go to Storage
2. The `guest-ids` bucket should already be created by the seed script
3. If not, create it manually with the following settings:
   - Bucket name: `guest-ids`
   - Public: `false`
   - File size limit: `5MB`
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,application/pdf`

### 4. Authentication Setup

1. In Supabase Dashboard, go to Authentication > Settings
2. Set Site URL to your app URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-app.onrender.com/auth/callback` (production)

### 5. Local Development

1. Clone/download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.sample .env.local
   ```

4. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### 6. Create Demo Users

Since we're using magic link authentication, you need to create users manually:

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" and create users with these emails:
   - `admin@hostizzy.com` (Admin role)
   - `owner@example.com` (Owner role)
   - `manager@example.com` (Manager role)
   - `guest@example.com` (Guest role)
3. The profiles will be created automatically on first login with default guest role
4. Update roles manually in the `profiles` table via Supabase Table Editor

### 7. Deploy to Render

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/hostizzy-pms.git
   git push -u origin main
   ```

2. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `18`

3. Add environment variables in Render:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NODE_ENV=production
   ```

4. Deploy and update your Supabase auth settings with the production URL

## 🔐 User Roles & Permissions

### Admin
- Full system access
- Create/manage properties and users
- View all data across properties
- Import/export functionality

### Owner
- View properties they own
- Access reservations and analytics for their properties
- View reviews and revenue data
- Read-only access to most features

### Manager
- Manage assigned properties
- Handle reservations and KYC
- Manage menus and availability
- Process check-ins/check-outs

### Guest
- Complete KYC for their reservations
- Select meal preferences
- Submit reviews post-stay
- View only their own reservation data

## 📊 Key Features Overview

### Reservation Management
- Create, edit, and track reservations
- Multi-channel support (Direct, Airbnb, MMT, Booking.com)
- Status tracking (Tentative → Confirmed → Completed)
- Pricing breakdown with taxes and fees

### Guest KYC System
- Primary guest adds secondary guest details
- ID document uploads (Aadhaar, Passport, DL, etc.)
- 180-day automatic deletion post-checkout
- Verification workflow for managers

### Menu & Meal Management
- Property-specific menu builder
- Fixed menus vs à la carte options
- Day-wise availability settings
- Guest meal selections by date and meal type

### Analytics & Reporting
- Revenue tracking and trends
- Occupancy rates and ADR calculation
- RevPAR metrics
- Property performance comparison

### CSV Import System
- Bulk reservation uploads
- Data validation and error reporting
- Dry-run preview before import
- Support for multiple date formats

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── properties/        # Property management
│   ├── reservations/      # Reservation management
│   ├── guests/           # Guest management
│   ├── menus/            # Menu management
│   ├── reviews/          # Review system
│   ├── analytics/        # Analytics dashboard
│   ├── import/           # CSV import functionality
│   └── guest/            # Public guest pages (KYC, reviews)
├── components/           # Reusable React components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard-specific components
│   └── forms/           # Form components
├── lib/                 # Utility libraries
│   ├── supabase.ts     # Supabase client configuration
│   └── utils.ts        # Helper functions
└── types/              # TypeScript type definitions
    └── database.ts     # Database type definitions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:reset        # Reset database (if script exists)
npm run db:seed         # Seed database (if script exists)

# Utilities
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check if RLS policies are properly set up
   - Ensure user has correct role in profiles table

2. **Authentication Not Working**
   - Verify redirect URLs in Supabase auth settings
   - Check CORS settings in Supabase
   - Ensure email templates are configured

3. **File Upload Issues**
   - Verify storage bucket exists and has correct policies
   - Check file size limits (5MB default)
   - Ensure supported MIME types are configured

4. **Permission Errors**
   - Check user role in profiles table
   - Verify RLS policies are active
   - Ensure property ownership/management assignments

### Database Reset

If you need to reset the database:

1. Go to Supabase SQL Editor
2. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Re-run the schema, RLS, and seed scripts

## 📝 Environment Variables

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

### Optional
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email configuration
- `FROM_EMAIL` - Sender email address
- `APP_URL` - Application URL for redirects

## 🚀 Phase 2 Features (Roadmap)

- Owner payouts and GST-compliant invoicing
- iCal sync for channel calendars
- Dynamic pricing and minimum stay rules
- WhatsApp/SMS notifications
- Public booking website integration
- Mobile app for on-site managers
- Advanced reporting and exports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Hostizzy. All rights reserved.

## 💬 Support

For support and questions:
- Email: support@hostizzy.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]
