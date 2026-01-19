# Quick Start Guide - AI CaseManager Frontend

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📱 Features Overview

### Authentication Pages
- **Login** (`/login`) - Demo: demo@example.com / password
- **Register** (`/register`) - Create new account
- **Forgot Password** (`/forgot-password`) - Password reset flow

### Main Application
- **Dashboard** (`/dashboard`) - Overview with stats and activity
- **Appointments** (`/appointments`) - Manage appointments
- **Cases** (`/cases`) - Case management
- **Clients** (`/clients`) - Client database
- **Calendar** (`/calendar`) - Calendar view
- **AI Assistant** (`/ai-assistant`) - AI-powered help
- **Reports** (`/reports`) - Analytics and reports
- **Settings** (`/settings`) - App configuration
- **Profile** (`/profile`) - User profile

## 🎨 Key Features

### ✅ Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Adaptive layouts

### ✅ Dark Mode
- Toggle in top navigation bar
- Smooth transitions
- All components support dark mode
- Persists across pages (in current session)

### ✅ Navigation
- Sidebar with icons
- Active page highlighting
- Quick actions
- Search functionality

### ✅ Components
- Reusable UI components
- Form validation
- Alert messages
- Loading states
- Badges and status indicators

## 🧪 Testing the App

### Test Authentication
1. Go to `/login`
2. Use demo credentials:
   - Email: `demo@example.com`
   - Password: `password`
3. Click "Sign In"
4. You'll be redirected to dashboard

### Test Dark Mode
1. Click the 🌙 icon in top bar
2. Watch the theme change
3. Navigate between pages
4. Theme persists

### Test Mobile View
1. Resize browser to < 768px
2. Click hamburger menu (☰)
3. Sidebar slides in from left
4. Click outside to close

### Test Navigation
1. Click any menu item in sidebar
2. Page changes
3. Active item is highlighted
4. Breadcrumb updates

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components (legacy)
│   └── navigation/      # Navigation components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard page
│   ├── appointments/    # Appointment pages
│   ├── cases/           # Case pages
│   ├── clients/         # Client pages
│   └── ...              # Other pages
├── layouts/
│   ├── MainLayout.jsx   # Main app layout
│   └── AuthLayout.jsx   # Auth pages layout
├── routes/
│   ├── AppRoutes.jsx    # Main routing
│   └── AuthRoutes.jsx   # Auth routing
├── context/             # React Context
├── services/            # API services
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── theme/               # Global styles
```

## 🎯 Current Status

### ✅ Completed
- Authentication UI (Login, Register, Forgot Password)
- Main layout with sidebar and topbar
- Dashboard with stats and widgets
- Dark mode support
- Responsive design
- Navigation system
- Reusable components
- Form validation
- Placeholder pages

### 🚧 Not Yet Implemented
- Backend API integration
- Real data fetching
- User authentication logic
- Chart libraries
- Real-time updates
- File uploads
- Advanced search
- Notifications system

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Available variables:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_AI_SERVICE_URL` - AI service endpoint
- `VITE_ENABLE_ANALYTICS` - Enable analytics

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Colors
- Spacing
- Breakpoints
- Fonts

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

Preview production build:
```bash
npm run preview
```

## 🐛 Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 3001, // Change this
}
```

### Dark Mode Not Working
Make sure `darkMode: 'class'` is in `tailwind.config.js`

### Components Not Styling
1. Check if Tailwind CSS is imported in `main.jsx`
2. Verify `postcss.config.js` exists
3. Restart dev server

## 📚 Next Steps

### To Connect Backend:
1. Update `src/services/api.js` with real API URL
2. Replace mock handlers in auth pages
3. Implement token storage
4. Add protected routes
5. Handle API errors

### To Add Charts:
1. Install chart library: `npm install recharts` or `npm install chart.js`
2. Replace placeholder divs in Dashboard
3. Connect to data sources

### To Enhance:
1. Add more pages
2. Implement search
3. Add filters and sorting
4. Create forms for data entry
5. Add file upload
6. Implement notifications

## 🤝 Development Tips

- Use `getDiagnostics` to check for errors
- Follow existing component patterns
- Keep components small and focused
- Use Tailwind utility classes
- Test on mobile devices
- Check dark mode for all new components

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review component examples
3. Test in different browsers
4. Check console for errors

---

**Happy Coding! 🚀**
