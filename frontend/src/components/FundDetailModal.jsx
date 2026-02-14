import { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const FundDetailModal = ({ fund, onClose }) => {
  const [historicalData, setHistoricalData] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('1Y') // 1M, 6M, 1Y, 3Y, 5Y

  useEffect(() => {
    fetchHistoricalData()
  }, [fund.id, timeRange])

  const fetchHistoricalData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/mutual-funds/${fund.id}/history`)
      
      if (response.data && response.data.data) {
        const dataPoints = filterDataByTimeRange(response.data.data)
        setHistoricalData(dataPoints)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching historical data:', error)
      setLoading(false)
    }
  }

  const filterDataByTimeRange = (data) => {
    const days = {
      '1M': 30,
      '6M': 180,
      '1Y': 365,
      '3Y': 365 * 3,
      '5Y': 365 * 5
    }
    
    return data.slice(0, days[timeRange] || 365).map(item => ({
      date: item.date,
      nav: parseFloat(item.nav)
    }))
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
          <p className="text-lg font-bold text-indigo-600">₹{payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{fund.name}</h2>
              <p className="text-indigo-100">{fund.fundHouse}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Current NAV</div>
              <div className="text-2xl font-bold text-indigo-600">₹{fund.nav.toFixed(2)}</div>
              <div className="text-xs text-gray-500 mt-1">{fund.navDate}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">1 Year Return</div>
              <div className="text-2xl font-bold text-green-600">{fund.returns_1yr}%</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">3 Year Return</div>
              <div className="text-2xl font-bold text-blue-600">{fund.returns_3yr}%</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">5 Year Return</div>
              <div className="text-2xl font-bold text-purple-600">{fund.returns_5yr}%</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">NAV Performance</h3>
              
              {/* Time Range Selector */}
              <div className="flex gap-2">
                {['1M', '6M', '1Y', '3Y', '5Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      timeRange === range
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fill="url(#colorNav)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Fund Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Fund Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Category</div>
                <div className="text-lg font-semibold text-gray-800">{fund.category}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Fund Manager</div>
                <div className="text-lg font-semibold text-gray-800">{fund.fundManager}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Fund Size (AUM)</div>
                <div className="text-lg font-semibold text-gray-800">{fund.fundSize}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Expense Ratio</div>
                <div className="text-lg font-semibold text-gray-800">{fund.expenseRatio}%</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Investment Details</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Minimum Investment</div>
                <div className="text-lg font-semibold text-gray-800">₹{fund.minInvestment.toLocaleString()}</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Risk Level</div>
                <div className={`text-lg font-semibold ${
                  fund.riskLevel === 'Very High' ? 'text-red-600' :
                  fund.riskLevel === 'High' ? 'text-orange-600' :
                  fund.riskLevel === 'Moderately High' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {fund.riskLevel}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 p-4 rounded-lg">
                <div className="text-sm text-indigo-700 font-semibold mb-2">💡 Investment Tip</div>
                <div className="text-sm text-gray-700">
                  {fund.category === 'Gold Fund' 
                    ? 'Gold funds are ideal for portfolio diversification and hedge against inflation.'
                    : fund.riskLevel === 'Very High'
                    ? 'High risk funds are suitable for aggressive investors with long-term horizon.'
                    : fund.category === 'Index Fund'
                    ? 'Index funds offer low-cost passive investing tracking market indices.'
                    : 'Diversify your portfolio across different fund categories for balanced returns.'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              Start SIP
            </button>
            <button className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all">
              Invest Lumpsum
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundDetailModal