# LeadCRM - Lead Management Dashboard

A modern, full-stack CRM dashboard for managing leads with analytics, search, filtering, and detailed lead views.

## 🚀 Features

- **Authentication**: Secure login system with demo credentials
- **Dashboard**: Analytics overview with key metrics
  - Total leads count
  - Converted leads and conversion rate
  - Pipeline value and revenue won
  - Visual charts for leads by status and source
- **Lead Management**: Comprehensive lead list with:
  - Real-time search across name, email, and company
  - Filter by status and source
  - Sort by name, value, or creation date
  - Pagination (20 leads per page)
- **Lead Details**: Detailed view for each lead with contact information, timeline, and notes
- **Mobile Responsive**: Fully responsive design for all screen sizes
- **500 Seeded Leads**: Pre-populated with realistic dummy data

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, React Router v7
- **Styling**: CSS Modules with design tokens
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Data**: Mock data simulating backend API (ready for MongoDB integration)

## 📦 Setup Instructions

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd lead-management-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

## 🔐 Demo Credentials

Use these credentials to log in:

- **Email**: `demo@leadcrm.com`
- **Password**: `demo123`

## 📊 Data Structure

The application includes 500 pre-seeded leads with the following attributes:

- Personal information (name, email, phone)
- Company details (company name, position, industry)
- Lead status (new, contacted, qualified, proposal, negotiation, won, lost)
- Lead source (website, referral, social, email, phone, event, partner)
- Deal value and timeline
- Notes and location

## 🎨 Design System

The application follows a professional design system with:

- **Color Palette**:
  - Neutral: Slate (clean, professional backgrounds)
  - Accent: Indigo (trustworthy brand color)
  - Success: Green (positive feedback)
  - Error: Red (critical alerts)
  - Warning: Amber (informational states)

- **Typography**: Inter font family for modern, readable text
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Components**: Reusable UI components with proper accessibility

## 🔄 API Simulation

The current implementation uses mock data that simulates backend API responses. The data layer is structured to easily integrate with a real MongoDB backend:

### Planned API Endpoints

```
GET  /api/leads              - Get leads with search, filter, sort, pagination
GET  /api/leads/:id          - Get single lead by ID
POST /api/leads              - Create new lead
PUT  /api/leads/:id          - Update lead
DELETE /api/leads/:id        - Delete lead
GET  /api/analytics          - Get analytics metrics
```

### Environment Variables (for MongoDB integration)

Create a `.env` file with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 📱 Features Breakdown

### Dashboard Page

- 4 key metric cards with icons
- Visual bar charts for status and source distribution
- Recent leads list with quick navigation
- Responsive grid layout

### Leads Page

- Search bar with real-time filtering
- Status and source dropdown filters
- Sortable table columns
- Pagination controls
- Click-through to lead details

### Lead Detail Page

- Complete contact information
- Deal value and timeline
- Status badge
- Notes section
- Back navigation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect React Router and deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `build/client` folder to Netlify

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`

## 📝 Future Enhancements

- MongoDB Atlas integration
- Real authentication with JWT
- Lead creation and editing forms
- Email integration
- Activity timeline
- Export to CSV
- Advanced analytics and reporting
- Team collaboration features

## 🤝 Contributing

This is a take-home assignment project. For production use, consider:

- Implementing real backend API
- Adding comprehensive error handling
- Setting up proper authentication
- Adding unit and integration tests
- Implementing data validation
- Adding loading states and optimistic updates

## 📄 License

MIT License - feel free to use this project as a starting point for your own CRM application.

---

Built with ❤️ using React Router v7 and modern web technologies.
