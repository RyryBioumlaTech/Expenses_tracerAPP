# PennyTracer - Expense Tracker

A modern, beautiful expense tracking application built with Next.js and Appwrite. Track your expenses, revenue, and gain insights into your financial habits.

## Features

- **User Authentication** - Secure sign up and login with Appwrite
- **Dashboard Overview** - View total expenses, revenue, and net difference at a glance
- **Interactive Charts** - Visualize spending patterns with daily/weekly expense vs revenue charts
- **Category Insights** - See your top expense and revenue categories
- **Transaction Management** - Add, edit, and delete expense and revenue entries
- **Custom Categories** - Create personalized categories with icons
- **Period Filtering** - Filter data by custom date ranges
- **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Appwrite (Auth, Database)
- **UI Components**: Shadcn UI, Lucide Icons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- [Appwrite](https://appwrite.io/) account (free tier available)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RyryBioumlaTech/Expenses_tracerAPP
cd expense-tracker-dash
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Appwrite

1. Create a new project in your [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new database
3. Create the following collections:

#### Categories Collection
| Attribute | Type | Required |
|-----------|------|----------|
| name | string | Yes |
| type | string | Yes (values: "expense" or "revenu") |
| icon | string | Yes (lucide icon name, e.g., "wallet", "car") |
| userId | string | Yes |

#### Expenses Collection
| Attribute | Type | Required |
|-----------|------|----------|
| description | string | Yes |
| amount | number | Yes |
| categoryId | string | Yes |
| userId | string | Yes |

#### Revenue Collection
| Attribute | Type | Required |
|-----------|------|----------|
| description | string | Yes |
| amount | number | Yes |
| categoryId | string | Yes |
| userId | string | Yes |

4. Set up collection permissions (Document Security enabled, allow users to CRUD their own documents)

### 4. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your Appwrite credentials:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_DATABASE_ID=your-database-id
NEXT_PUBLIC_EXPENSE_ID=your-expenses-collection-id
NEXT_PUBLIC_REVENUE_ID=your-revenue-collection-id
NEXT_PUBLIC_CATEGORY_ID=your-categories-collection-id
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                  # Next.js app router pages
│   ├── dashboard/        # Dashboard and manage pages
│   ├── login/            # Authentication page
│   └── page.tsx          # Landing page
├── components/           # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useTransaction.ts # Transaction CRUD operations
│   ├── useCategory.ts    # Category management
│   └── ...
├── lib/                  # Utility functions
│   └── appwrite.ts       # Appwrite client configuration
└── public/               # Static assets
```

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Self-hosted with `npm run build && npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.
