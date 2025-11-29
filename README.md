# Maglo - Finance & Invoice Management

A modern, full-featured invoice management system built with Next.js, React, and Appwrite. Maglo helps businesses manage invoices, track payments, monitor VAT, and visualize financial data with an intuitive dashboard.

🔗 **Live Demo**: [maglo-three.vercel.app](https://maglo-three.vercel.app)

---

## ✨ Features

### 📊 Dashboard
- Real-time financial metrics overview
- Interactive working capital charts with customizable time ranges (7, 30, 90 days)
- VAT summary and tracking
- Due date tracker for pending payments
- Recent invoices at a glance

### 🧾 Invoice Management
- Create, view, edit, and delete invoices
- Dynamic line item management with automatic calculations
- Customizable VAT rates
- Invoice status tracking (Paid, Unpaid, Pending)
- Client information management
- Auto-generated invoice numbers
- Responsive invoice detail view

### 💰 Financial Tracking
- Total invoice amount tracking
- Paid vs. pending payment monitoring
- VAT collection and reporting
- Monthly and all-time financial summaries
- Income vs. expenses visualization

### 🔐 Authentication
- Secure user authentication with Appwrite
- Email/password login and registration
- Protected routes with auth guards
- Session management

### 📱 Responsive Design
- Fully responsive mobile-first design
- Optimized for desktop, tablet, and mobile devices
- Modern UI with Tailwind CSS
- Interactive components with Radix UI

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, tw-animate-css
- **UI Components**: Radix UI, Lucide React icons
- **Backend**: Appwrite (BaaS)
- **Charts**: Recharts
- **Form Management**: React Hook Form, Zod validation
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Appwrite account and project setup
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maglo.git
   cd maglo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=invoices
   ```

4. **Configure Appwrite**
   
   Create a database and collection in your Appwrite project with these attributes:
   - `userId` (string, required)
   - `clientName` (string, required)
   - `clientEmail` (email, required)
   - `clientAvatar` (string)
   - `amount` (float, required)
   - `vat` (float, required)
   - `vatAmount` (float, required)
   - `total` (float, required)
   - `dueDate` (string, required)
   - `issuedDate` (string, required)
   - `status` (string, required)
   - `invoiceNumber` (string, required)
   - `items` (string) - stores JSON array

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [https://maglo-three.vercel.app ]
---

## 📁 Project Structure

```
maglo/
├── app/
│   ├── dashboard/          # Dashboard page and components
│   ├── invoices/           # Invoice management pages
│   │   ├── [id]/          # Invoice detail page
│   │   └── create/        # Create invoice page
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Authentication page
├── components/
│   ├── auths/             # Authentication forms
│   ├── toasts/            # Toast notification system
│   ├── ui/                # Reusable UI components
│   ├── due-date-tracker.tsx
│   └── vat-summary.tsx
├── lib/
│   ├── appwrite.ts        # Appwrite configuration
│   ├── auth-guard.ts      # Route protection hooks
│   ├── context.tsx        # Global state management
│   └── toast.tsx          # Toast notification hook
├── public/                # Static assets
└── middleware.ts          # Next.js middleware
```

---

## 🎨 Key Features Breakdown

### Dashboard Metrics
- **Total Invoice**: Sum of all invoices created
- **Amount Paid**: Total of paid invoices
- **Pending Payment**: Sum of unpaid and pending invoices

### Working Capital Chart
- Visual representation of income vs. expenses
- Filterable by time period (7, 30, 90 days)
- Interactive tooltips with detailed data
- Real-time updates based on invoice status

### VAT Management
- Customizable VAT percentage per invoice
- Monthly VAT collection tracking
- VAT breakdown by paid invoices
- Total revenue calculations

### Invoice System
- Dynamic line item addition and removal
- Automatic subtotal, VAT, and total calculations
- Client information persistence
- Status management (Paid, Unpaid, Pending)
- Invoice numbering system

---

## 🔒 Authentication Flow

1. User registers with name, email, and password
2. Appwrite creates account and session
3. User is automatically logged in
4. Protected routes check for valid session
5. Logout clears session and redirects to login

---

## 📊 Data Management

All invoice data is stored in Appwrite with:
- User-specific data isolation
- Real-time synchronization
- Automatic timestamps
- Secure API endpoints

---

## 🎯 Future Enhancements

- [ ] PDF invoice generation
- [ ] Email invoice delivery
- [ ] Recurring invoice support
- [ ] Multi-currency support
- [ ] Client management system
- [ ] Advanced reporting and analytics
- [ ] Dark mode toggle
- [ ] Invoice templates
- [ ] Payment gateway integration
- [ ] Expense tracking

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Oluwadamilola Otunla**

- Website: [maglo-three.vercel.app](https://maglo-three.vercel.app)
- GitHub: [@yourusername](https://github.com/Soft00750)

---

## 🙏 Tools

- [Next.js](https://nextjs.org/) - React framework
- [Appwrite](https://appwrite.io/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Recharts](https://recharts.org/) - Chart library
- [Vercel](https://vercel.com/) - Deployment platform

---


---

