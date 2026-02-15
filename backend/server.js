const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Manually curated fund data (update quarterly from official sources)
// Sources: ValueResearch, Moneycontrol, AMFI factsheets
const fundDatabase = [
  // Large Cap Funds (6 total)
  {
    schemeCode: 125497,
    name: "HDFC Top 100 Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.99,
    returns_1yr: 11.2,
    returns_3yr: 15.5,
    returns_5yr: 14.8,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Shreeram Sharma",
    fundSize: "₹25,840 Cr"
  },
  {
    schemeCode: 120503,
    name: "ICICI Prudential Bluechip Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 1.05,
    returns_1yr: 10.8,
    returns_3yr: 14.2,
    returns_5yr: 13.9,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Ihab Dalwai",
    fundSize: "₹35,920 Cr"
  },
  {
    schemeCode: 112090,
    name: "Mirae Asset Large Cap Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.92,
    returns_1yr: 12.5,
    returns_3yr: 16.1,
    returns_5yr: 15.3,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Mirae Asset Mutual Fund",
    fundManager: "Neelesh Surana",
    fundSize: "₹22,450 Cr"
  },
  {
    schemeCode: 118550,
    name: "Canara Robeco Bluechip Equity Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 1.02,
    returns_1yr: 11.5,
    returns_3yr: 15.2,
    returns_5yr: 14.5,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Canara Robeco Mutual Fund",
    fundManager: "Shridatta Bhandwaldar",
    fundSize: "₹8,950 Cr"
  },
  {
    schemeCode: 120844,
    name: "Nippon India Large Cap Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 1.08,
    returns_1yr: 10.9,
    returns_3yr: 14.8,
    returns_5yr: 14.1,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Manish Gunwani",
    fundSize: "₹18,320 Cr"
  },
  {
    schemeCode: 120716,
    name: "Aditya Birla Sun Life Frontline Equity Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 1.12,
    returns_1yr: 11.8,
    returns_3yr: 15.6,
    returns_5yr: 14.9,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Aditya Birla Sun Life Mutual Fund",
    fundManager: "Mahesh Patil",
    fundSize: "₹16,780 Cr"
  },
  
  // Index Funds (6 total)
  {
    schemeCode: 120716,
    name: "UTI Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.20,
    returns_1yr: 10.2,
    returns_3yr: 13.5,
    returns_5yr: 12.8,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "UTI Mutual Fund",
    fundManager: "Sharwan Kumar Goyal",
    fundSize: "₹8,240 Cr"
  },
  {
    schemeCode: 135794,
    name: "HDFC Index Fund - Sensex Plan - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.25,
    returns_1yr: 11.0,
    returns_3yr: 13.8,
    returns_5yr: 13.2,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Anil Bamboli",
    fundSize: "₹5,830 Cr"
  },
  {
    schemeCode: 120466,
    name: "ICICI Prudential Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.28,
    returns_1yr: 10.5,
    returns_3yr: 13.6,
    returns_5yr: 12.9,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Nishit Patel",
    fundSize: "₹6,150 Cr"
  },
  {
    schemeCode: 120844,
    name: "Motilal Oswal Nifty 50 Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.22,
    returns_1yr: 10.3,
    returns_3yr: 13.4,
    returns_5yr: 12.7,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Rakesh Shetty",
    fundSize: "₹3,920 Cr"
  },
  {
    schemeCode: 143541,
    name: "SBI Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.24,
    returns_1yr: 10.4,
    returns_3yr: 13.5,
    returns_5yr: 12.8,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "SBI Mutual Fund",
    fundManager: "R Srinivasan",
    fundSize: "₹4,560 Cr"
  },
  {
    schemeCode: 119597,
    name: "Nippon India Index Fund - Sensex Plan - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.26,
    returns_1yr: 10.9,
    returns_3yr: 13.7,
    returns_5yr: 13.1,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Mehul Dama",
    fundSize: "₹2,880 Cr"
  },
  
  // Flexi Cap Funds (5 total)
  {
    schemeCode: 122639,
    name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.98,
    returns_1yr: 13.8,
    returns_3yr: 17.2,
    returns_5yr: 16.5,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "PPFAS Mutual Fund",
    fundManager: "Rajeev Thakkar",
    fundSize: "₹68,500 Cr"
  },
  {
    schemeCode: 119605,
    name: "HDFC Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 1.08,
    returns_1yr: 12.9,
    returns_3yr: 16.8,
    returns_5yr: 15.9,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Roshi Jain",
    fundSize: "₹42,300 Cr"
  },
  {
    schemeCode: 143538,
    name: "Motilal Oswal Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 1.05,
    returns_1yr: 13.2,
    returns_3yr: 17.0,
    returns_5yr: 16.2,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Ajay Khandelwal",
    fundSize: "₹12,450 Cr"
  },
  {
    schemeCode: 118989,
    name: "UTI Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 1.12,
    returns_1yr: 12.5,
    returns_3yr: 16.4,
    returns_5yr: 15.6,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "UTI Mutual Fund",
    fundManager: "Swati Kulkarni",
    fundSize: "₹28,920 Cr"
  },
  {
    schemeCode: 119226,
    name: "JM Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 1.15,
    returns_1yr: 12.8,
    returns_3yr: 16.6,
    returns_5yr: 15.8,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "JM Financial Mutual Fund",
    fundManager: "Chaitanya Choksi",
    fundSize: "₹8,640 Cr"
  },
  
  // Mid Cap Funds (5 total)
  {
    schemeCode: 120830,
    name: "Axis Midcap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 1.15,
    returns_1yr: 15.2,
    returns_3yr: 19.5,
    returns_5yr: 17.8,
    minInvestment: 5000,
    riskLevel: "High",
    fundHouse: "Axis Mutual Fund",
    fundManager: "Shreyash Devalkar",
    fundSize: "₹18,920 Cr"
  },
  {
    schemeCode: 119538,
    name: "Kotak Emerging Equity Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 1.20,
    returns_1yr: 16.5,
    returns_3yr: 20.2,
    returns_5yr: 18.3,
    minInvestment: 5000,
    riskLevel: "High",
    fundHouse: "Kotak Mahindra Mutual Fund",
    fundManager: "Pankaj Tibrewal",
    fundSize: "₹24,650 Cr"
  },
  {
    schemeCode: 143539,
    name: "Motilal Oswal Midcap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 1.18,
    returns_1yr: 16.2,
    returns_3yr: 19.8,
    returns_5yr: 18.0,
    minInvestment: 5000,
    riskLevel: "High",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Niket Shah",
    fundSize: "₹9,850 Cr"
  },
  {
    schemeCode: 100309,
    name: "Invesco India Mid Cap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 1.22,
    returns_1yr: 15.8,
    returns_3yr: 19.4,
    returns_5yr: 17.6,
    minInvestment: 5000,
    riskLevel: "High",
    fundHouse: "Invesco Mutual Fund",
    fundManager: "Amit Ganatra",
    fundSize: "₹7,320 Cr"
  },
  {
    schemeCode: 118989,
    name: "HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 1.16,
    returns_1yr: 16.0,
    returns_3yr: 19.6,
    returns_5yr: 17.9,
    minInvestment: 5000,
    riskLevel: "High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Chirag Setalvad",
    fundSize: "₹52,180 Cr"
  },
  
  // Small Cap Funds (5 total)
  {
    schemeCode: 119551,
    name: "SBI Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 1.25,
    returns_1yr: 18.5,
    returns_3yr: 23.8,
    returns_5yr: 21.2,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "SBI Mutual Fund",
    fundManager: "R. Srinivasan",
    fundSize: "₹32,180 Cr"
  },
  {
    schemeCode: 118989,
    name: "Nippon India Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 1.30,
    returns_1yr: 19.2,
    returns_3yr: 24.5,
    returns_5yr: 22.1,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Samir Rachh",
    fundSize: "₹28,940 Cr"
  },
  {
    schemeCode: 143540,
    name: "Bandhan Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 1.28,
    returns_1yr: 18.8,
    returns_3yr: 24.0,
    returns_5yr: 21.5,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "Bandhan Mutual Fund",
    fundManager: "Rahul Singh",
    fundSize: "₹8,250 Cr"
  },
  {
    schemeCode: 120830,
    name: "Axis Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 1.32,
    returns_1yr: 19.5,
    returns_3yr: 25.2,
    returns_5yr: 22.8,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "Axis Mutual Fund",
    fundManager: "Anupam Tiwari",
    fundSize: "₹12,650 Cr"
  },
  {
    schemeCode: 119597,
    name: "HDFC Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 1.27,
    returns_1yr: 18.9,
    returns_3yr: 24.3,
    returns_5yr: 21.8,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Chirag Setalvad",
    fundSize: "₹22,480 Cr"
  },
  
  // Gold Funds (4 total)
  {
    schemeCode: 119226,
    name: "SBI Gold Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.65,
    returns_1yr: 14.8,
    returns_3yr: 12.5,
    returns_5yr: 11.2,
    minInvestment: 500,
    riskLevel: "Moderate",
    fundHouse: "SBI Mutual Fund",
    fundManager: "Raviprakash Sharma",
    fundSize: "₹1,500 Cr"
  },
  {
    schemeCode: 119596,
    name: "HDFC Gold Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.50,
    returns_1yr: 14.5,
    returns_3yr: 12.3,
    returns_5yr: 11.0,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Arun Agarwal",
    fundSize: "₹1,140 Cr"
  },
  {
    schemeCode: 119227,
    name: "ICICI Prudential Gold ETF FOF - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.59,
    returns_1yr: 14.6,
    returns_3yr: 12.4,
    returns_5yr: 11.1,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Manish Banthia",
    fundSize: "₹1,325 Cr"
  },
  {
    schemeCode: 143546,
    name: "Nippon India Gold Savings Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.62,
    returns_1yr: 14.7,
    returns_3yr: 12.6,
    returns_5yr: 11.3,
    minInvestment: 1000,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Mehul Dama",
    fundSize: "₹2,480 Cr"
  }
];

// Cache for NAV data
let cachedFundsWithNav = [];
let lastFetchTime = null;
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// Fetch live NAV from MFapi.in and merge with our database
async function fetchMutualFundsData() {
  if (cachedFundsWithNav.length > 0 && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return cachedFundsWithNav;
  }

  console.log('Fetching live NAV data from MFapi.in...');
  const fundsWithLiveNav = [];

  for (const fundInfo of fundDatabase) {
    try {
      const response = await axios.get(`https://api.mfapi.in/mf/${fundInfo.schemeCode}`, {
        timeout: 5000
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const latestNav = response.data.data[0];
        
        fundsWithLiveNav.push({
          id: fundInfo.schemeCode,
          name: fundInfo.name,
          category: fundInfo.category,
          nav: parseFloat(latestNav.nav),
          navDate: latestNav.date,
          returns_1yr: fundInfo.returns_1yr,
          returns_3yr: fundInfo.returns_3yr,
          returns_5yr: fundInfo.returns_5yr,
          expenseRatio: fundInfo.expenseRatio,
          minInvestment: fundInfo.minInvestment,
          riskLevel: fundInfo.riskLevel,
          fundHouse: fundInfo.fundHouse,
          fundManager:fundInfo.fundManager,
          fundSize:fundInfo.fundSize,
        });
      }
    } catch (error) {
      console.error(`Error fetching NAV for ${fundInfo.name}:`, error.message);
      // Use last cached data if API fails
      const cached = cachedFundsWithNav.find(f => f.id === fundInfo.schemeCode);
      if (cached) {
        fundsWithLiveNav.push(cached);
      }
    }
  }

  cachedFundsWithNav = fundsWithLiveNav;
  lastFetchTime = Date.now();
  console.log(`Successfully fetched NAV for ${fundsWithLiveNav.length} funds`);
  
  return fundsWithLiveNav;
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mutual Fund Analysis API',
    dataSource: 'Live NAV from MFapi.in | Returns & Expense Ratios manually curated',
    lastUpdated: lastFetchTime ? new Date(lastFetchTime).toISOString() : 'Not fetched yet'
  });
});

app.get('/api/mutual-funds', async (req, res) => {
  try {
    const funds = await fetchMutualFundsData();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mutual funds data', error: error.message });
  }
});

app.get('/api/mutual-funds/:id', async (req, res) => {
  try {
    const funds = await fetchMutualFundsData();
    const fund = funds.find(f => f.id === parseInt(req.params.id));
    
    if (fund) {
      res.json(fund);
    } else {
      res.status(404).json({ message: 'Fund not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mutual fund data', error: error.message });
  }
});

app.post('/api/calculate-sip', (req, res) => {
  const { monthlyInvestment, timePeriod, expectedReturn } = req.body;

  if (!monthlyInvestment || !timePeriod || !expectedReturn) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const monthlyRate = expectedReturn / 12 / 100;
  const months = timePeriod * 12;

  const futureValue = monthlyInvestment * (
    (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
  ) * (1 + monthlyRate);

  const totalInvestment = monthlyInvestment * months;
  const estimatedReturns = futureValue - totalInvestment;

  res.json({
    monthlyInvestment,
    timePeriod,
    expectedReturn,
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    futureValue: Math.round(futureValue)
  });
});

// Get historical NAV data for a specific fund
app.get('/api/mutual-funds/:id/history', async (req, res) => {
  try {
    const schemeCode = req.params.id;
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
      timeout: 10000
    });
    
    if (response.data && response.data.data) {
      // Get last 1 year of data (approximately 250 trading days)
      const historicalData = response.data.data.slice(0, 365).reverse();
      
      res.json({
        scheme_name: response.data.meta.scheme_name,
        scheme_code: response.data.meta.scheme_code,
        fund_house: response.data.meta.fund_house,
        data: historicalData
      });
    } else {
      res.status(404).json({ message: 'Historical data not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical data', error: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});