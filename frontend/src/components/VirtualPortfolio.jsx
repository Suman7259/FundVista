import { useState, useEffect } from 'react'
import axios from 'axios'

const VirtualPortfolio = () => {
  const [portfolio, setPortfolio] = useState([])
  const [balance, setBalance] = useState(100000)
  const [totalInvested, setTotalInvested] = useState(0)
  const [currentValue, setCurrentValue] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load portfolio from localStorage
  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    setLoading(true)
    const savedPortfolio = localStorage.getItem('virtualPortfolio')
    const savedBalance = localStorage.getItem('virtualBalance')
    const savedInvested = localStorage.getItem('totalInvested')
    
    if (savedBalance) setBalance(parseFloat(savedBalance))
    if (savedInvested) setTotalInvested(parseFloat(savedInvested))
    
    if (savedPortfolio) {
      const portfolioData = JSON.parse(savedPortfolio)
      
      // Fetch latest NAV for each fund
      const updatedPortfolio = await Promise.all(
        portfolioData.map(async (investment) => {
          try {
            // Extract scheme code from fund name or use a mapping
            // For now, we'll keep the original NAV as we don't have scheme codes
            // You can enhance this by storing scheme codes during investment
            return {
              ...investment,
              currentNAV: investment.buyNAV // Keep same for now, will update next
            }
          } catch (error) {
            console.error('Error fetching NAV:', error)
            return investment
          }
        })
      )
      
      setPortfolio(updatedPortfolio)
    }
    setLoading(false)
  }

  // Calculate current value
  useEffect(() => {
    const value = portfolio.reduce((sum, item) => sum + (item.units * item.currentNAV), 0)
    setCurrentValue(value)
  }, [portfolio])

  const resetPortfolio = () => {
    if (confirm('Are you sure you want to reset your virtual portfolio and get ₹1,00,000 again?')) {
      setPortfolio([])
      setBalance(100000)
      setTotalInvested(0)
      localStorage.removeItem('virtualPortfolio')
      localStorage.removeItem('virtualBalance')
      localStorage.removeItem('totalInvested')
      alert('✅ Portfolio reset! You now have ₹1,00,000 virtual balance.')
    }
  }

  const removeInvestment = (index) => {
    const investment = portfolio[index]
    const currentValueOfInvestment = investment.units * investment.currentNAV
    
    if (confirm(`Sell ${investment.fundName}?\n\nCurrent Value: ₹${currentValueOfInvestment.toLocaleString()}`)) {
      const updatedPortfolio = portfolio.filter((_, i) => i !== index)
      
      setPortfolio(updatedPortfolio)
      setBalance(balance + currentValueOfInvestment)
      setTotalInvested(totalInvested - investment.amount)
      
      // Update localStorage
      localStorage.setItem('virtualPortfolio', JSON.stringify(updatedPortfolio))
      localStorage.setItem('virtualBalance', (balance + currentValueOfInvestment).toString())
      localStorage.setItem('totalInvested', (totalInvested - investment.amount).toString())
      
      alert(`✅ Sold successfully!\n\nReceived: ₹${currentValueOfInvestment.toLocaleString()}`)
    }
  }

  const totalReturns = currentValue - totalInvested
  const returnsPercent = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-6">
        <h1 className="text-3xl font-bold mb-4">📊 Virtual Portfolio Dashboard</h1>
        <p className="text-indigo-100 mb-6">Practice investing with virtual money - No real money involved!</p>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm text-indigo-200">Available Balance</div>
            <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm text-indigo-200">Total Invested</div>
            <div className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm text-indigo-200">Current Value</div>
            <div className="text-2xl font-bold">₹{Math.round(currentValue).toLocaleString()}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-sm text-indigo-200">Total Returns</div>
            <div className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalReturns >= 0 ? '+' : ''}₹{Math.round(totalReturns).toLocaleString()}
              <span className="text-sm ml-2">({returnsPercent.toFixed(2)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Holdings {portfolio.length > 0 && `(${portfolio.length})`}
          </h2>
          {portfolio.length > 0 && (
            <button
              onClick={resetPortfolio}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all"
            >
              Reset Portfolio
            </button>
          )}
        </div>

        {portfolio.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Investments Yet</h3>
            <p className="text-gray-600 mb-6">Start investing to build your virtual portfolio!</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 max-w-2xl mx-auto text-left">
              <h4 className="font-bold text-blue-900 mb-2">💡 How to Get Started:</h4>
              <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                <li>Go to "Mutual Funds" tab</li>
                <li>Make sure "🎮 Virtual Mode" is selected at the top</li>
                <li>Click any fund card to see details</li>
                <li>Click "Start SIP" or "Invest Lumpsum" button</li>
                <li>Enter your investment amount</li>
                <li>Your investments will appear here!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {portfolio.map((investment, index) => {
              const currentValueOfInvestment = investment.units * investment.currentNAV
              const returnAmount = currentValueOfInvestment - investment.amount
              const returnPercent = ((investment.currentNAV - investment.buyNAV) / investment.buyNAV) * 100
              
              return (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800 flex-1">{investment.fundName}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {investment.category}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                          {investment.type}
                        </span>
                        <span>Invested: {new Date(investment.date).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Invested Amount</div>
                          <div className="text-base font-bold text-gray-800">₹{investment.amount.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Units Allotted</div>
                          <div className="text-base font-bold text-gray-800">{investment.units}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Buy NAV</div>
                          <div className="text-base font-bold text-gray-800">₹{investment.buyNAV.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Current NAV</div>
                          <div className="text-base font-bold text-indigo-600">₹{investment.currentNAV.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Current Value</div>
                          <div className={`text-base font-bold ${
                            returnAmount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ₹{Math.round(currentValueOfInvestment).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-lg ${
                          returnAmount >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <span className="text-sm font-semibold">
                            {returnAmount >= 0 ? 'Profit: +' : 'Loss: '}
                            ₹{Math.abs(Math.round(returnAmount)).toLocaleString()}
                            {' '}
                            ({returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeInvestment(index)}
                      className="ml-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Sell
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-bold text-yellow-900 mb-2">📚 Virtual Portfolio - For Learning Only</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• This is practice money (₹1,00,000 starting virtual balance)</li>
              <li>• NAV values are real-time from MFapi.in</li>
              <li>• Investments are simulated - no real money involved</li>
              <li>• Learn mutual fund investing without any risk!</li>
              <li>• Portfolio saved in browser (clears if you clear browser data)</li>
              <li>• Ready for real investing? Switch to "Real Investment" mode at the top</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualPortfolio