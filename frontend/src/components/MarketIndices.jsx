import { useState, useEffect } from 'react'
import axios from 'axios'

const MarketIndices = () => {
  const [indices, setIndices] = useState([])
  const [loading, setLoading] = useState(true)
  const [marketOpen, setMarketOpen] = useState(false)

  useEffect(() => {
    checkMarketStatus()
    fetchIndices()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      checkMarketStatus()
      fetchIndices()
    }, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const checkMarketStatus = () => {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 6 = Saturday
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const currentTime = hours * 60 + minutes // Convert to minutes since midnight

    // Market timings: Monday-Friday, 9:15 AM - 3:30 PM IST
    const marketOpenTime = 9 * 60 + 15  // 9:15 AM = 555 minutes
    const marketCloseTime = 15 * 60 + 30 // 3:30 PM = 930 minutes

    // Check if it's a weekday (Monday = 1 to Friday = 5)
    const isWeekday = day >= 1 && day <= 5
    
    // Check if current time is within market hours
    const isDuringMarketHours = currentTime >= marketOpenTime && currentTime <= marketCloseTime

    setMarketOpen(isWeekday && isDuringMarketHours)
  }

  const fetchIndices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/market-indices')
      
      if (response.data && response.data.length > 0) {
        setIndices(response.data)
      } else {
        setIndices(getMockData())
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching indices:", error)
      setIndices(getMockData())
      setLoading(false)
    }
  }

  const getMockData = () => {
    return [
      {
        name: "NIFTY 50",
        value: 23458.85,
        change: 156.25,
        changePercent: 0.67,
        symbol: "^NSEI"
      },
      {
        name: "SENSEX",
        value: 77586.50,
        change: 234.80,
        changePercent: 0.30,
        symbol: "^BSESN"
      },
      {
        name: "BANK NIFTY",
        value: 51245.30,
        change: -128.45,
        changePercent: -0.25,
        symbol: "^NSEBANK"
      },
      {
        name: "NIFTY IT",
        value: 42156.75,
        change: 312.60,
        changePercent: 0.75,
        symbol: "^CNXIT"
      },
      {
        name: "NIFTY MIDCAP",
        value: 58234.90,
        change: 445.20,
        changePercent: 0.77,
        symbol: "^NSEMDCP50"
      }
    ]
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="animate-pulse text-sm">Loading market data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          {/* Market Status - Dynamic based on time */}
          <div className="flex items-center gap-2 mr-6 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${marketOpen ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
              <span className="text-xs font-semibold">
                {marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
              </span>
            </div>
          </div>

          {/* Indices */}
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {indices.map((index, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-3 py-1 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-all flex-shrink-0 cursor-pointer"
              >
                {/* Index Name */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-300">{index.name}</span>
                  <span className="text-sm font-bold">
                    {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Change */}
                <div className={`flex flex-col items-end ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="flex items-center gap-1">
                    {index.change >= 0 ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="text-xs font-bold">
                      {Math.abs(index.change).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs font-semibold">
                    ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="flex-shrink-0 ml-6 text-xs text-gray-400 hidden md:block">
            Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default MarketIndices