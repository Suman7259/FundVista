# Mutual Fund Analysis Project

A full-stack web application for analyzing mutual funds and calculating SIP (Systematic Investment Plan) returns.

## 🚀 Features

1. **Mutual Funds List**
   - Display a comprehensive list of mutual funds
   - Filter by category (Large Cap, Mid Cap, Small Cap, etc.)
   - View key metrics: NAV, returns (1yr, 3yr, 5yr), expense ratio
   - Risk level indicators

2. **SIP Calculator**
   - Calculate potential returns on SIP investments
   - Visual breakdown of investment vs returns
   - Customizable parameters (monthly amount, time period, expected return)
   - Real-time calculation with detailed summary

## 📁 Project Structure

```
mutual-fund-app/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   └── package.json       # Backend dependencies
└── frontend/
    ├── index.html         # HTML entry point (Vite)
    ├── vite.config.js     # Vite configuration
    ├── src/
    │   ├── components/
    │   │   ├── MutualFundsList.jsx    # Funds listing component
    │   │   └── SIPCalculator.jsx      # SIP calculator component
    │   ├── App.jsx        # Main application component
    │   ├── App.css        # Application styles
    │   ├── main.jsx       # React entry point
    │   └── index.css      # Base styles
    └── package.json       # Frontend dependencies
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server (faster than Create React App)
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## 🔧 Installation & Setup

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd mutual-fund-app
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the development server with auto-restart
npm run dev
```

The backend server will run on `http://localhost:5000` and automatically restart when you make changes.

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The React app will automatically open in your browser at `http://localhost:3000`

> **Note:** Vite provides ultra-fast Hot Module Replacement (HMR) and instant server start!

## 🎯 Usage

### Viewing Mutual Funds

1. Click on the "📊 Mutual Funds" tab
2. Browse the list of available mutual funds
3. Use the category filter to narrow down options
4. View details like NAV, returns, expense ratio, and risk level

### Using SIP Calculator

1. Click on the "🧮 SIP Calculator" tab
2. Enter your monthly investment amount (minimum ₹500)
3. Select investment period (1-40 years)
4. Set expected annual return rate (typically 8-15% for equity)
5. Click "Calculate Returns"
6. View the detailed breakdown of:
   - Total investment
   - Estimated returns
   - Future value
   - Visual representation of investment composition

## 📡 API Endpoints

### GET `/api/mutual-funds`
Returns a list of all mutual funds

**Response:**
```json
[
  {
    "id": 1,
    "name": "HDFC Top 100 Fund",
    "category": "Large Cap",
    "nav": 850.25,
    "returns_1yr": 12.5,
    "returns_3yr": 15.8,
    "returns_5yr": 14.2,
    "expenseRatio": 1.05,
    "minInvestment": 5000,
    "riskLevel": "Moderate"
  }
]
```

### GET `/api/mutual-funds/:id`
Returns details of a specific mutual fund

### POST `/api/calculate-sip`
Calculates SIP returns

**Request Body:**
```json
{
  "monthlyInvestment": 5000,
  "timePeriod": 10,
  "expectedReturn": 12
}
```

**Response:**
```json
{
  "monthlyInvestment": 5000,
  "timePeriod": 10,
  "expectedReturn": 12,
  "totalInvestment": 600000,
  "estimatedReturns": 548528,
  "futureValue": 1148528
}
```

## 🎨 Features Breakdown

### Mutual Funds List Features
- ✅ Display all mutual funds with key information
- ✅ Category-based filtering
- ✅ Responsive card layout
- ✅ Color-coded risk levels
- ✅ Performance metrics (1yr, 3yr, 5yr returns)
- ✅ Hover effects for better UX

### SIP Calculator Features
- ✅ Interactive input form
- ✅ Real-time calculation
- ✅ Visual breakdown chart
- ✅ Currency formatting (₹ INR)
- ✅ Detailed investment summary
- ✅ Input validation
- ✅ Responsive design

## 🔄 Future Enhancements

Potential features for future versions:
- User authentication and portfolio tracking
- Real-time data integration with financial APIs
- Historical performance charts
- Comparison tool for multiple funds
- Investment recommendations based on risk profile
- Export reports as PDF
- Mobile app version

## ⚡ Why Vite?

This project uses Vite instead of Create React App for several advantages:
- **Lightning Fast:** Instant server start and ultra-fast HMR
- **Optimized Builds:** Better production bundle optimization
- **Modern:** Native ES modules support
- **Faster Development:** Significantly improved developer experience

## 🎯 Development vs Production

### Development (with auto-reload):
```bash
# Backend - starts with nodemon (auto-restarts on file changes)
cd backend
npm run dev

# Frontend - starts Vite dev server (instant HMR)
cd frontend
npm run dev
```

### Production:
```bash
# Backend - runs without nodemon
cd backend
npm start

# Frontend - build for production
cd frontend
npm run build
npm run preview  # Preview production build locally
```

## 🐛 Troubleshooting

### Backend server not starting
- Ensure port 5000 is not in use
- Check if Node.js is properly installed: `node --version`

### Frontend not connecting to backend
- Verify backend is running on port 5000
- Check CORS settings in `server.js`
- Clear browser cache and reload

### npm install errors
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Try using `npm install --legacy-peer-deps`

## 📝 Notes

- The mutual funds data is currently mock data for demonstration
- In production, integrate with actual financial data APIs
- SIP calculations use compound interest formula
- Returns shown are for illustrative purposes only
- Vite proxy configuration (`vite.config.js`) handles API routing seamlessly

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

To modify or extend the project:

1. **Adding new mutual funds**: Edit the `mutualFunds` array in `backend/server.js`
2. **Changing styles**: Modify `frontend/src/App.css`
3. **Adding features**: Create new components in `frontend/src/components/`
4. **Vite Configuration**: Edit `frontend/vite.config.js` for build/proxy settings

---

**Happy Investing! 💰📈**
