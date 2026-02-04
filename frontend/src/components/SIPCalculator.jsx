import { useState } from 'react'
import axios from 'axios'

const SIPCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyInvestment: 5000,
    timePeriod: 10,
    expectedReturn: 12
  })

  const [results, setResults] = useState(null)
  const [calculating, setCalculating] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const calculateSIP = async (e) => {
    e.preventDefault()
    setCalculating(true)

    try {
      const response = await axios.post('http://localhost:5000/api/calculate-sip', formData)
      setResults(response.data)
    } catch (error) {
      alert('Failed to calculate SIP. Please ensure the backend server is running.')
    } finally {
      setCalculating(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">SIP Calculator</h2>
      
      <form onSubmit={calculateSIP} className="space-y-6 mb-8">
        {/* Monthly Investment */}
        <div className="space-y-2">
          <label htmlFor="monthlyInvestment" className="block text-lg font-semibold text-gray-700">
            Monthly Investment Amount
          </label>
          <input
            type="number"
            id="monthlyInvestment"
            name="monthlyInvestment"
            value={formData.monthlyInvestment}
            onChange={handleInputChange}
            min="500"
            step="500"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-lg transition-colors"
          />
          <span className="text-sm text-gray-500">Minimum ₹500</span>
        </div>

        {/* Time Period */}
        <div className="space-y-2">
          <label htmlFor="timePeriod" className="block text-lg font-semibold text-gray-700">
            Investment Period (Years)
          </label>
          <input
            type="number"
            id="timePeriod"
            name="timePeriod"
            value={formData.timePeriod}
            onChange={handleInputChange}
            min="1"
            max="40"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-lg transition-colors"
          />
          <span className="text-sm text-gray-500">1 to 40 years</span>
        </div>

        {/* Expected Return */}
        <div className="space-y-2">
          <label htmlFor="expectedReturn" className="block text-lg font-semibold text-gray-700">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            id="expectedReturn"
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleInputChange}
            min="1"
            max="30"
            step="0.5"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 text-lg transition-colors"
          />
          <span className="text-sm text-gray-500">Typically 8% - 15% for equity funds</span>
        </div>

        {/* Calculate Button */}
        <button
          type="submit"
          disabled={calculating}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {calculating ? 'Calculating...' : 'Calculate Returns'}
        </button>
      </form>

      {/* Results Section */}
      {results && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Investment Summary
          </h3>
          
          {/* Results Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-sm text-gray-500 mb-2">Total Investment</div>
              <div className="text-3xl font-bold text-indigo-600">
                {formatCurrency(results.totalInvestment)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-sm text-gray-500 mb-2">Estimated Returns</div>
              <div className="text-3xl font-bold text-indigo-600">
                {formatCurrency(results.estimatedReturns)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-sm text-gray-500 mb-2">Future Value</div>
              <div className="text-4xl font-bold text-green-600">
                {formatCurrency(results.futureValue)}
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="border-t-2 border-gray-300 pt-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Investment Breakdown
            </h4>
            
            {/* Visual Bar */}
            <div className="flex h-16 rounded-lg overflow-hidden shadow-lg mb-6">
              <div 
                className="bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm px-4"
                style={{ width: `${(results.totalInvestment / results.futureValue) * 100}%` }}
              >
                Invested: {formatCurrency(results.totalInvestment)}
              </div>
              <div 
                className="bg-green-500 flex items-center justify-center text-white font-semibold text-sm px-4"
                style={{ width: `${(results.estimatedReturns / results.futureValue) * 100}%` }}
              >
                Returns: {formatCurrency(results.estimatedReturns)}
              </div>
            </div>
            
            {/* Summary Text */}
            <div className="text-center text-gray-600 leading-relaxed">
              <p>
                By investing <strong className="text-gray-800">{formatCurrency(formData.monthlyInvestment)}</strong> monthly 
                for <strong className="text-gray-800">{formData.timePeriod} years</strong> at an expected return 
                of <strong className="text-gray-800">{formData.expectedReturn}%</strong> per year, 
                your investment can grow to <strong className="text-green-600 text-lg">{formatCurrency(results.futureValue)}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SIPCalculator