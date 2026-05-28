# Favour Pharmacy Tracker

A comprehensive pharmacy management system designed to streamline operations for pharmacy owners and staff. Track inventory, manage sales, monitor debts, handle expenses, and generate detailed reports—all from a single, intuitive dashboard.

## Features

### 📊 Dashboard
- Real-time overview of key metrics
- Quick access to critical information
- Activity logs and recent transactions

### 💊 Inventory Management
- Track drug stock levels
- Monitor low stock items with alerts
- Manage product details and pricing
- Unit of measure configuration

### 💰 Sales Management
- Record and track sales transactions
- Payment method tracking
- Sales history and analytics

### 📈 Reports & Analytics
- Generate comprehensive sales reports
- Track performance trends
- Visual charts and data visualization
- Customizable reporting periods

### 💳 Debt Management
- Track customer debts
- Record payment history
- Automated WhatsApp reminders for outstanding balances
- Debt status monitoring

### 💸 Expense Tracking
- Log and categorize business expenses
- Monitor spending patterns
- Expense reports and analytics

### 👥 Staff Management
- Manage pharmacy staff records
- Role-based access control
- Staff performance tracking

### ⚙️ Settings & Configuration
- Customize pharmacy details (name, location, contact info)
- Configure currency and payment methods
- Set inventory alert thresholds
- WhatsApp integration setup
- Theme customization (light/dark mode)
- Security settings

### 🔔 Notifications
- Real-time alerts for low stock
- Debt reminders
- System notifications

### 👤 User Profile
- Manage user account information
- Pharmacy license and registration details
- Pharmacist credentials

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React
- **Charts**: Recharts
- **Animations**: Motion
- **Backend**: Express.js
- **Storage**: Browser LocalStorage

## Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Favour-Pharmacy-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start the development server on port 3000
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Remove build artifacts

## Project Structure

```
src/
├── components/        # React components for each view
├── App.tsx           # Main application component
├── main.tsx          # Entry point
├── types.ts          # TypeScript type definitions
├── data.ts           # Initial/sample data
└── index.css         # Global styles
```

## Usage

1. **Launch the app** - Start with the landing page
2. **Sign up** - Create a pharmacy account
3. **Configure Settings** - Set up your pharmacy details, preferences, and integrations
4. **Manage Inventory** - Add drugs and track stock levels
5. **Record Transactions** - Log sales and expenses
6. **Track Debts** - Monitor customer outstanding balances
7. **Generate Reports** - View analytics and performance metrics

## Data Persistence

All data is stored locally in the browser's LocalStorage, allowing you to work offline and persist data across sessions.

## License

Proprietary - Favour Pharmacy Tracker

---

Built with ❤️ for pharmacy management excellence
