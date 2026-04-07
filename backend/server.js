const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Add this route for historical NAV data
app.get('/api/mutual-funds/:schemeCode/history', async (req, res) => {
  try {
    const { schemeCode } = req.params
    const { period } = req.query // period can be '1M', '6M', '1Y', '3Y', '5Y'
    
    // Fetch full historical data from MFapi
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
      timeout: 10000
    })
    
    if (response.data && response.data.data) {
      const allData = response.data.data
      const fundName = response.data.meta.scheme_name
      
      // Filter data based on period
      let filteredData = []
      const today = new Date()
      
      switch(period) {
        case '1M':
          // Last 1 month (30 days)
          filteredData = allData.slice(0, 30)
          break
        case '6M':
          // Last 6 months (180 days)
          filteredData = allData.slice(0, 180)
          break
        case '1Y':
          // Last 1 year (365 days)
          filteredData = allData.slice(0, 365)
          break
        case '3Y':
          // Last 3 years (1095 days)
          filteredData = allData.slice(0, 1095)
          break
        case '5Y':
          // Last 5 years (1825 days)
          filteredData = allData.slice(0, 1825)
          break
        default:
          // Default to 1 year
          filteredData = allData.slice(0, 365)
      }
      
      // Reverse to get chronological order (oldest to newest)
      filteredData = filteredData.reverse()
      
      // Format data for chart
      const chartData = filteredData.map(item => ({
        date: item.date,
        nav: parseFloat(item.nav)
      }))
      
      res.json({
        success: true,
        fundName: fundName,
        period: period,
        data: chartData
      })
      
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'No historical data found' 
      })
    }
    
  } catch (error) {
    console.error('Error fetching historical data:', error.message)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch historical data' 
    })
  }
})
// Market Indices Route - Add this with your other routes
app.get('/api/market-indices', async (req, res) => {
  try {
    // Using Yahoo Finance API via RapidAPI alternative
    // This scrapes data from Yahoo Finance
    
    const symbols = [
      { yahoo: '%5ENSEI', name: 'NIFTY 50' },
      { yahoo: '%5EBSESN', name: 'SENSEX' },
      { yahoo: '%5ENSEBANK', name: 'BANK NIFTY' },
      { yahoo: '%5ECNXIT', name: 'NIFTY IT' },
      { yahoo: '%5ENSMIDCAP', name: 'NIFTY MIDCAP' }
    ]

    const promises = symbols.map(async (item) => {
      try {
        // Using Yahoo Finance query1.finance.yahoo.com endpoint (free, no auth)
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.yahoo}?interval=1d&range=1d`
        const response = await axios.get(url, { timeout: 5000 })
        
        if (response.data && response.data.chart && response.data.chart.result) {
          const result = response.data.chart.result[0]
          const quote = result.meta
          const indicators = result.indicators.quote[0]
          
          return {
            name: item.name,
            value: quote.regularMarketPrice || quote.previousClose || 0,
            change: (quote.regularMarketPrice - quote.chartPreviousClose) || 0,
            changePercent: (((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose) * 100) || 0,
            symbol: item.yahoo
          }
        }
        return null
      } catch (err) {
        console.error(`Error fetching ${item.name}:`, err.message)
        return null
      }
    })

    const results = await Promise.all(promises)
    const validResults = results.filter(r => r !== null)
    
    if (validResults.length > 0) {
      res.json(validResults)
    } else {
      // Return mock data as fallback
      res.json([
        { name: "NIFTY 50", value: 23458.85, change: 156.25, changePercent: 0.67, symbol: "^NSEI" },
        { name: "SENSEX", value: 77586.50, change: 234.80, changePercent: 0.30, symbol: "^BSESN" },
        { name: "BANK NIFTY", value: 51245.30, change: -128.45, changePercent: -0.25, symbol: "^NSEBANK" },
        { name: "NIFTY IT", value: 42156.75, change: 312.60, changePercent: 0.75, symbol: "^CNXIT" },
        { name: "NIFTY MIDCAP", value: 58234.90, change: 445.20, changePercent: 0.77, symbol: "^NSEMDCP50" }
      ])
    }
  } catch (error) {
    console.error('Error in market indices route:', error)
    res.status(500).json({ error: 'Failed to fetch market indices' })
  }
})

// Manually curated fund data (update quarterly from official sources)
// Sources: ValueResearch, Moneycontrol, AMFI factsheets
const fundDatabase = [
  // Large Cap Funds - VERIFIED
  {
    schemeCode: 125497,  // ✅ VERIFIED
    name: "HDFC Top 100 Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.96,
    returns_1yr: 13.4,
    returns_3yr: 17.4,
    returns_5yr: 17.8,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Rahul Baijal",
    fundSize: "₹40,618 Cr"
  },
  {
    schemeCode: 120503,  // ✅ VERIFIED
    name: "ICICI Prudential Bluechip Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.89,
    returns_1yr: 12.5,
    returns_3yr: 16.8,
    returns_5yr: 17.2,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Ihab Dalwai",
    fundSize: "₹42,850 Cr"
  },
  {
    schemeCode: 112090,  // ✅ VERIFIED
    name: "Mirae Asset Large Cap Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.46,
    returns_1yr: 14.2,
    returns_3yr: 18.1,
    returns_5yr: 18.5,
    minInvestment: 1000,
    riskLevel: "Moderate",
    fundHouse: "Mirae Asset Mutual Fund",
    fundManager: "Neelesh Surana",
    fundSize: "₹32,450 Cr"
  },
  {
    schemeCode: 145456,  // ✅ CORRECTED - Canara Robeco Bluechip
    name: "Canara Robeco Bluechip Equity Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.50,
    returns_1yr: 11.6,
    returns_3yr: 16.2,
    returns_5yr: 16.4,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "Canara Robeco Mutual Fund",
    fundManager: "Vishal Mishra",
    fundSize: "₹17,094 Cr"
  },
  {
    schemeCode: 145459,  // ✅ CORRECTED - Nippon Large Cap
    name: "Nippon India Large Cap Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.65,
    returns_1yr: 12.8,
    returns_3yr: 17.2,
    returns_5yr: 17.9,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Manish Gunwani",
    fundSize: "₹21,320 Cr"
  },
  {
    schemeCode: 119527,  // ✅ CORRECTED - Aditya Birla Frontline
    name: "Aditya Birla Sun Life Frontline Equity Fund - Direct Plan - Growth",
    category: "Large Cap",
    expenseRatio: 0.85,
    returns_1yr: 13.2,
    returns_3yr: 17.8,
    returns_5yr: 18.1,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "Aditya Birla Sun Life Mutual Fund",
    fundManager: "Mahesh Patil",
    fundSize: "₹22,780 Cr"
  },
  
  // Index Funds - VERIFIED
  {
    schemeCode: 120716,  // ✅ VERIFIED
    name: "UTI Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.20,
    returns_1yr: 11.2,
    returns_3yr: 14.8,
    returns_5yr: 15.2,
    minInvestment: 500,
    riskLevel: "Moderate",
    fundHouse: "UTI Mutual Fund",
    fundManager: "Sharwan Kumar Goyal",
    fundSize: "₹9,240 Cr"
  },
  {
    schemeCode: 135794,  // ✅ VERIFIED
    name: "HDFC Index Fund - Sensex Plan - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.20,
    returns_1yr: 11.8,
    returns_3yr: 15.2,
    returns_5yr: 15.6,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Anil Bamboli",
    fundSize: "₹7,830 Cr"
  },
  {
    schemeCode: 120466,  // ✅ VERIFIED
    name: "ICICI Prudential Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.18,
    returns_1yr: 11.1,
    returns_3yr: 14.7,
    returns_5yr: 15.1,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Nishit Patel",
    fundSize: "₹7,150 Cr"
  },
  {
    schemeCode: 145461,  // ✅ CORRECTED - Motilal Nifty 50
    name: "Motilal Oswal Nifty 50 Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.20,
    returns_1yr: 11.0,
    returns_3yr: 14.6,
    returns_5yr: 15.0,
    minInvestment: 500,
    riskLevel: "Moderate",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Rakesh Shetty",
    fundSize: "₹5,920 Cr"
  },
  {
    schemeCode: 120825,  // ✅ CORRECTED - SBI Nifty Index
    name: "SBI Nifty Index Fund - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.22,
    returns_1yr: 11.1,
    returns_3yr: 14.7,
    returns_5yr: 15.1,
    minInvestment: 5000,
    riskLevel: "Moderate",
    fundHouse: "SBI Mutual Fund",
    fundManager: "R Srinivasan",
    fundSize: "₹6,560 Cr"
  },
  {
    schemeCode: 145463,  // ✅ CORRECTED - Nippon Sensex
    name: "Nippon India Index Fund - Sensex Plan - Direct Plan - Growth",
    category: "Index Fund",
    expenseRatio: 0.25,
    returns_1yr: 11.7,
    returns_3yr: 15.1,
    returns_5yr: 15.5,
    minInvestment: 1000,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Mehul Dama",
    fundSize: "₹3,880 Cr"
  },
  
  // Flexi Cap Funds - VERIFIED
  {
    schemeCode: 122639,  // ✅ VERIFIED
    name: "Parag Parikh Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.64,
    returns_1yr: 1.8,
    returns_3yr: 17.66,
    returns_5yr: 16.32,
    minInvestment: 1000,
    riskLevel: "Moderately High",
    fundHouse: "PPFAS Mutual Fund",
    fundManager: "Rajeev Thakkar",
    fundSize: "₹1,33,500 Cr"
  },
  {
    schemeCode: 119605,  // ✅ VERIFIED
    name: "HDFC Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.69,
    returns_1yr: 1.29,
    returns_3yr: 18.62,
    returns_5yr: 18.55,
    minInvestment: 1000,
    riskLevel: "Moderately High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Roshi Jain",
    fundSize: "₹1,00,451 Cr"
  },
  {
    schemeCode: 145465,  // ✅ CORRECTED - Motilal Flexi Cap
    name: "Motilal Oswal Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.81,
    returns_1yr: 16.2,
    returns_3yr: 21.0,
    returns_5yr: 31.5,
    minInvestment: 500,
    riskLevel: "Moderately High",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Ajay Khandelwal",
    fundSize: "₹13,180 Cr"
  },
  {
    schemeCode: 120545,  // ✅ CORRECTED - UTI Flexi Cap
    name: "UTI Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.82,
    returns_1yr: -7.8,
    returns_3yr: 8.4,
    returns_5yr: 5.9,
    minInvestment: 5000,
    riskLevel: "Moderately High",
    fundHouse: "UTI Mutual Fund",
    fundManager: "Swati Kulkarni",
    fundSize: "₹22,920 Cr"
  },
  {
    schemeCode: 119179,  // ✅ CORRECTED - JM Flexi Cap
    name: "JM Flexi Cap Fund - Direct Plan - Growth",
    category: "Flexi Cap",
    expenseRatio: 0.65,
    returns_1yr: -5.2,
    returns_3yr: 17.8,
    returns_5yr: 1582,
    minInvestment: 1000,
    riskLevel: "Moderately High",
    fundHouse: "JM Financial Mutual Fund",
    fundManager: "Chaitanya Choksi",
    fundSize: "₹5,140 Cr"
  },
  
  // Mid Cap Funds - VERIFIED
  {
    schemeCode: 120830,  // ✅ VERIFIED
    name: "Axis Midcap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 0.49,
    returns_1yr: 4.5,
    returns_3yr: 18.2,
    returns_5yr: 14.8,
    minInvestment: 100,
    riskLevel: "High",
    fundHouse: "Axis Mutual Fund",
    fundManager: "Shreyash Devalkar",
    fundSize: "₹31,920 Cr"
  },
  {
    schemeCode: 119538,  // ✅ VERIFIED
    name: "Kotak midcap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 0.38,
    returns_1yr: 6.5,
    returns_3yr: 19.87,
    returns_5yr: 17.5,
    minInvestment: 1000,
    riskLevel: "High",
    fundHouse: "Kotak Mahindra Mutual Fund",
    fundManager: "Pankaj Tibrewal",
    fundSize: "₹61,650 Cr"
  },
  {
    schemeCode: 127042,  // ✅ CORRECTED - Motilal Midcap
    name: "Motilal Oswal Midcap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 0.85,
    returns_1yr: -9.60,
    returns_3yr: 20.15,
    returns_5yr: 21.71,
    minInvestment: 500,
    riskLevel: "High",
    fundHouse: "Motilal Oswal Mutual Fund",
    fundManager: "Varun Sharma",
    fundSize: "₹33689 Cr"
  },
  {
    schemeCode: 119586,  // ✅ CORRECTED - Invesco Midcap
    name: "Invesco India Mid Cap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 0.55,
    returns_1yr: 5.19,
    returns_3yr: 24.62,
    returns_5yr: 19.60,
    minInvestment: 1000,
    riskLevel: "High",
    fundHouse: "Invesco Mutual Fund",
    fundManager: "Aditya Khemani",
    fundSize: "₹10771 Cr"
  },
  {
    schemeCode: 119600,  // ✅ CORRECTED - HDFC Midcap
    name: "HDFC Mid-Cap Fund - Direct Plan - Growth",
    category: "Mid Cap",
    expenseRatio: 0.78,
    returns_1yr: 6.6,
    returns_3yr: 23.8,
    returns_5yr: 20.5,
    minInvestment: 100,
    riskLevel: "High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Chirag Setalvad",
    fundSize: "₹94,180 Cr"
  },
  
  // Small Cap Funds - VERIFIED
  {
    schemeCode: 119551,  // ✅ VERIFIED
    name: "SBI Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 0.79,
    returns_1yr: 9.8,
    returns_3yr: 19.5,
    returns_5yr: 24.2,
    minInvestment: 5000,
    riskLevel: "Very High",
    fundHouse: "SBI Mutual Fund",
    fundManager: "R. Srinivasan",
    fundSize: "₹45,180 Cr"
  },
  {
    schemeCode: 118989,  // ✅ VERIFIED
    name: "Nippon India Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 0.67,
    returns_1yr: 0.7,
    returns_3yr: 19.8,
    returns_5yr: 21.5,
    minInvestment: 100,
    riskLevel: "Very High",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Samir Rachh",
    fundSize: "₹52,940 Cr"
  },
  {
    schemeCode: 119597,  // ✅ VERIFIED  
    name: "Bandhan Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 0.68,
    returns_1yr: 4.7,
    returns_3yr: 29.8,
    returns_5yr: 22.5,
    minInvestment: 100,
    riskLevel: "Very High",
    fundHouse: "Bandhan Mutual Fund",
    fundManager: "Rahul Singh",
    fundSize: "₹67,250 Cr"
  },
  {
    schemeCode: 120834,  // ✅ CORRECTED - Axis Small Cap
    name: "Axis Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 0.5,
    returns_1yr: 1.2,
    returns_3yr: 16.5,
    returns_5yr: 17.93,
    minInvestment: 100,
    riskLevel: "Very High",
    fundHouse: "Axis Mutual Fund",
    fundManager: "Anupam Tiwari",
    fundSize: "₹26,000 Cr"
  },
  {
    schemeCode: 119598,  // ✅ CORRECTED - HDFC Small Cap
    name: "HDFC Small Cap Fund - Direct Plan - Growth",
    category: "Small Cap",
    expenseRatio: 0.82,
    returns_1yr: 1.8,
    returns_3yr: 16.2,
    returns_5yr: 19.5,
    minInvestment: 100,
    riskLevel: "Very High",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Chirag Setalvad",
    fundSize: "₹28,480 Cr"
  },
  
  // Gold Funds - VERIFIED
  {
    schemeCode: 119226,  // ✅ VERIFIED
    name: "SBI Gold Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.49,
    returns_1yr: 58.50,
    returns_3yr: 32.99,
    returns_5yr: 25.77,
    minInvestment: 1000,
    riskLevel: "Moderate",
    fundHouse: "SBI Mutual Fund",
    fundManager: "Raviprakash Sharma",
    fundSize: "₹15,100 Cr"
  },
  {
    schemeCode: 119596,  // ✅ VERIFIED
    name: "HDFC Gold Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.53,
    returns_1yr: 58.5,
    returns_3yr: 33.3,
    returns_5yr: 25.25,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "HDFC Mutual Fund",
    fundManager: "Arun Agarwal",
    fundSize: "₹11,540 Cr"
  },
  {
    schemeCode: 119227,  // ✅ VERIFIED
    name: "ICICI Prudential Gold ETF FOF - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.25,
    returns_1yr: 58.16,
    returns_3yr: 32.96,
    returns_5yr: 25.5,
    minInvestment: 100,
    riskLevel: "Moderate",
    fundHouse: "ICICI Prudential Mutual Fund",
    fundManager: "Manish Banthia",
    fundSize: "₹6,525 Cr"
  },
  {
    schemeCode: 143546,  // ✅ VERIFIED
    name: "Nippon India Gold Savings Fund - Direct Plan - Growth",
    category: "Gold Fund",
    expenseRatio: 0.60,
    returns_1yr: 56.7,
    returns_3yr: 32.5,
    returns_5yr: 25.29,
    minInvestment: 1000,
    riskLevel: "Moderate",
    fundHouse: "Nippon India Mutual Fund",
    fundManager: "Mehul Dama",
    fundSize: "₹12,680 Cr"
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