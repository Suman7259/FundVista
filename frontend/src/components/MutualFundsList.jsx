import { useState, useEffect } from 'react'
import axios from 'axios'
import FundDetailModal from './FundDetailModal'

const MutualFundsList = () => {
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedFund, setSelectedFund] = useState(null)

  useEffect(() => {
    fetchMutualFunds()
  }, [])

  const fetchMutualFunds = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/mutual-funds')
      setFunds(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch mutual funds. Please ensure the backend server is running.')
      setLoading(false)
    }
  }

  const categories = ['All', ...new Set(funds.map(fund => fund.category))]

  const filteredFunds = categoryFilter === 'All' 
    ? funds 
    : funds.filter(fund => fund.category === categoryFilter)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading mutual funds...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Available Mutual Funds</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">Filter by Category:</label>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white cursor-pointer transition-colors"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.map(fund => (
          <div 
            key={fund.id} 
            onClick={() => setSelectedFund(fund)}
            className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white"
          >
            {/* Fund Name */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-indigo-600 transition-colors">
              {fund.name}
            </h3>
            
            {/* Category Badge */}
            <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm px-4 py-1 rounded-full mb-4">
              {fund.category}
            </span>
            
            {/* NAV */}
            <div className="text-3xl font-bold text-indigo-600 mb-4">
              ₹{fund.nav.toFixed(2)}
              <span className="text-sm text-gray-500 font-normal ml-2">NAV</span>
            </div>

            {/* Returns Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">1 Year Return</div>
                <div className="text-lg font-bold text-green-600">{fund.returns_1yr}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">3 Year Return</div>
                <div className="text-lg font-bold text-green-600">{fund.returns_3yr}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">5 Year Return</div>
                <div className="text-lg font-bold text-green-600">{fund.returns_5yr}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Expense Ratio</div>
                <div className="text-lg font-bold text-gray-800">{fund.expenseRatio}%</div>
              </div>
            </div>

            {/* Min Investment */}
            <div className="bg-gray-50 p-3 rounded-lg mb-3">
              <div className="text-xs text-gray-500 mb-1">Minimum Investment</div>
              <div className="text-lg font-bold text-gray-800">₹{fund.minInvestment.toLocaleString()}</div>
            </div>

            {/* Risk Level */}
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-center py-2 rounded-lg font-semibold">
              Risk Level: {fund.riskLevel}
            </div>

            {/* Click to view details hint */}
            <div className="mt-3 text-center text-sm text-indigo-600 font-semibold">
              Click to view details →
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredFunds.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No mutual funds found for the selected category.</p>
        </div>
      )}

      {/* Fund Detail Modal */}
      {selectedFund && (
        <FundDetailModal 
          fund={selectedFund} 
          onClose={() => setSelectedFund(null)} 
        />
      )}
    </div>
  )
}

export default MutualFundsList