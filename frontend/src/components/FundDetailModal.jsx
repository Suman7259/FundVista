import { useState, useEffect } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const FundDetailModal = ({ fund, onClose }) => {
  const [historicalData, setHistoricalData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('1Y')
  const [loading, setLoading] = useState(true)
  const [showRecommendation, setShowRecommendation] = useState(false)

  useEffect(() => {
    if (fund) {
      fetchHistoricalData(selectedPeriod)
    }
  }, [fund, selectedPeriod])

  const fetchHistoricalData = async (period) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mutual-funds/${fund.id}/history?period=${period}`
      )
      
      if (response.data.success) {
        setHistoricalData(response.data.data)
      } else {
        console.error('Failed to fetch historical data')
        setHistoricalData([])
      }
    } catch (error) {
      console.error('Error fetching historical data:', error)
      setHistoricalData([])
    } finally {
      setLoading(false)
    }
  }

  // Investment recommendation logic
  const getInvestmentRecommendation = () => {
    const returns1Y = fund.returns_1yr
    const returns3Y = fund.returns_3yr
    const returns5Y = fund.returns_5yr
    const riskLevel = fund.riskLevel
    const category = fund.category

    let recommendation = {
      verdict: '',
      color: '',
      reasons: [],
      cautions: []
    }

    // Calculate average returns
    const avgReturns = (returns1Y + returns3Y + returns5Y) / 3

    // Good indicators
    if (returns3Y > 15 && returns5Y > 14) {
      recommendation.reasons.push('Consistent long-term performance over 3-5 years')
    }
    if (returns1Y > 12) {
      recommendation.reasons.push('Strong recent performance in the last year')
    }
    if (fund.expenseRatio < 1.0) {
      recommendation.reasons.push('Low expense ratio benefits long-term investors')
    }
    if (category === 'Index Fund' && fund.expenseRatio < 0.5) {
      recommendation.reasons.push('Excellent cost-efficiency for passive investing')
    }

    // Risk-based cautions
    if (riskLevel === 'Very High' || riskLevel === 'High') {
      recommendation.cautions.push('High volatility fund - suitable only for aggressive investors')
      recommendation.cautions.push('Requires minimum 5-7 year investment horizon')
    }
    if (returns1Y < 8) {
      recommendation.cautions.push('Recent underperformance compared to historical average')
    }
    if (category === 'Small Cap') {
      recommendation.cautions.push('Small cap funds can be highly volatile during market corrections')
    }
    if (fund.expenseRatio > 1.5) {
      recommendation.cautions.push('Higher expense ratio may impact long-term returns')
    }

    // Final verdict
    if (avgReturns > 15 && returns3Y > 14) {
      recommendation.verdict = 'Good Time to Invest'
      recommendation.color = 'green'
      recommendation.icon = '✓'
    } else if (avgReturns > 12 && returns3Y > 12) {
      recommendation.verdict = 'Moderate - Consider Your Risk Profile'
      recommendation.color = 'yellow'
      recommendation.icon = '⚠'
    } else {
      recommendation.verdict = 'Exercise Caution'
      recommendation.color = 'red'
      recommendation.icon = '⚠'
    }

    return recommendation
  }

  const recommendation = getInvestmentRecommendation()

  const handleStartSIP = () => {
    alert(`Starting SIP for ${fund.name}\n\nMinimum SIP: ₹${fund.minInvestment}\n\nThis will redirect to your broker/AMC platform.`)
  }

  const handleInvestLumpsum = () => {
    alert(`Investing Lumpsum in ${fund.name}\n\nMinimum Investment: ₹${fund.minInvestment}\n\nThis will redirect to your broker/AMC platform.`)
  }

  const periods = [
    { label: '1M', value: '1M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: '3Y', value: '3Y' },
    { label: '5Y', value: '5Y' }
  ]

  // Calculate min and max for Y-axis
  const navValues = historicalData.map(item => item.nav)
  const minNav = navValues.length > 0 ? Math.min(...navValues) * 0.95 : 0
  const maxNav = navValues.length > 0 ? Math.max(...navValues) * 1.05 : 100

  // Format date for tooltip
  const formatDate = (dateStr) => {
    const date = new Date(dateStr.split('-').reverse().join('-'))
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-2 border-indigo-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-800">
            Date: {formatDate(payload[0].payload.date)}
          </p>
          <p className="text-sm font-bold text-indigo-600">
            NAV: ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl text-white sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{fund.name}</h2>
              <div className="flex items-center gap-4">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {fund.category}
                </span>
                <span className="text-sm">{fund.fundHouse}</span>
              </div>
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

        {/* Current NAV Section */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Current NAV</div>
              <div className="text-4xl font-bold text-indigo-600">₹{fund.nav.toFixed(2)}</div>
              <div className="text-sm text-gray-500 mt-1">As of {fund.navDate}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Risk Level</div>
              <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                fund.riskLevel === 'Very High' ? 'bg-red-100 text-red-800' :
                fund.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                fund.riskLevel === 'Moderately High' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {fund.riskLevel}
              </div>
            </div>
          </div>

          {/* SHOULD I INVEST NOW BUTTON */}
          <div className="mb-4">
            <button
              onClick={() => setShowRecommendation(!showRecommendation)}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showRecommendation ? 'Hide Investment Analysis' : 'Should I Invest Now?'}
            </button>
          </div>

          {/* Investment Recommendation Panel */}
          {showRecommendation && (
            <div className={`mb-6 rounded-xl p-6 border-2 ${
              recommendation.color === 'green' ? 'bg-green-50 border-green-300' :
              recommendation.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
              'bg-red-50 border-red-300'
            }`}>
              {/* Verdict */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-3xl ${
                  recommendation.color === 'green' ? 'text-green-600' :
                  recommendation.color === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {recommendation.icon}
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${
                    recommendation.color === 'green' ? 'text-green-800' :
                    recommendation.color === 'yellow' ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>
                    {recommendation.verdict}
                  </h3>
                  <p className="text-sm text-gray-600">Based on historical performance analysis</p>
                </div>
              </div>

              {/* Positive Indicators */}
              {recommendation.reasons.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-green-600">✓</span> Positive Indicators:
                  </h4>
                  <ul className="space-y-1 ml-6">
                    {recommendation.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Factors */}
              {recommendation.cautions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-orange-600">⚠</span> Risk Factors to Consider:
                  </h4>
                  <ul className="space-y-1 ml-6">
                    {recommendation.cautions.map((caution, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-600 mt-0.5">•</span>
                        <span>{caution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Investment Horizon */}
              <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-800 mb-2">📅 Recommended Investment Horizon:</h4>
                <p className="text-sm text-gray-700">
                  {fund.riskLevel === 'Very High' || fund.riskLevel === 'High' ? 
                    '7-10 years or more for wealth creation' :
                    fund.riskLevel === 'Moderately High' ?
                    '5-7 years for optimal returns' :
                    '3-5 years minimum'
                  }
                </p>
              </div>

              {/* Critical Disclaimer */}
              <div className="bg-gray-800 text-white rounded-lg p-4">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  IMPORTANT DISCLAIMER
                </h4>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>This is an <strong>automated analysis</strong> based solely on historical data and does NOT constitute financial advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span><strong>Past performance is NOT indicative of future results.</strong> Market conditions can change rapidly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span><strong>Mutual fund investments are subject to market risks.</strong> You may lose part or all of your invested capital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Please read all scheme-related documents carefully and consult a <strong>SEBI-registered financial advisor</strong> before investing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Consider your financial goals, risk tolerance, and investment horizon before making any investment decision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>NaviGate and its creators are <strong>NOT liable</strong> for any investment decisions or losses incurred</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* START SIP AND INVEST LUMPSUM BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleStartSIP}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start SIP
            </button>
            <button
              onClick={handleInvestLumpsum}
              className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Invest Lumpsum
            </button>
          </div>
        </div>

        {/* HISTORICAL PERFORMANCE WITH PERIOD SELECTOR */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Historical Performance</h3>
            <div className="flex gap-2">
              {periods.map(period => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedPeriod === period.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 rounded-xl p-4">
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                  <p className="text-gray-600">Loading chart data...</p>
                </div>
              </div>
            ) : historicalData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => {
                      const d = new Date(date.split('-').reverse().join('-'))
                      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[minNav, maxNav]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorNav)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-500">No historical data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Fund Details Grid */}
        <div className="p-6 grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-semibold mb-1">1 Year Return</div>
            <div className="text-2xl font-bold text-blue-800">{fund.returns_1yr}%</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-semibold mb-1">3 Year Return</div>
            <div className="text-2xl font-bold text-green-800">{fund.returns_3yr}%</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-semibold mb-1">5 Year Return</div>
            <div className="text-2xl font-bold text-purple-800">{fund.returns_5yr}%</div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Fund Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Fund Manager</span>
              <span className="font-semibold text-gray-800">{fund.fundManager}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Fund Size (AUM)</span>
              <span className="font-semibold text-gray-800">{fund.fundSize}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Expense Ratio</span>
              <span className="font-semibold text-gray-800">{fund.expenseRatio}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Min Investment</span>
              <span className="font-semibold text-gray-800">₹{fund.minInvestment.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Investment Tips */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-b-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-3">💡 General Investment Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Invest for the long term (5+ years) for equity funds to ride out market volatility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Consider SIP (Systematic Investment Plan) for rupee cost averaging benefits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Review your portfolio quarterly but avoid reacting to short-term market movements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">✓</span>
              <span>Diversify across different fund categories to manage risk effectively</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default FundDetailModal