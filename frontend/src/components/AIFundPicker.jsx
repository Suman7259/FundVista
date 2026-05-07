import { useState, useRef } from 'react' // Added useRef
import axios from 'axios'
// Import html2pdf.js (Ensure you run: npm install html2pdf.js)
import html2pdf from 'html2pdf.js'

const AIFundPicker = () => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  
  // Create a reference for the PDF content
  const reportRef = useRef();

  // User inputs
  const [userProfile, setUserProfile] = useState({
    age: '',
    monthlyIncome: '',
    investmentAmount: '',
    investmentHorizon: '',
    riskTolerance: '',
    investmentGoal: '',
    existingInvestments: '',
    expectedReturns: ''
  })

  const handleInputChange = (field, value) => {
    setUserProfile({ ...userProfile, [field]: value })
  }

  // --- PDF DOWNLOAD LOGIC ---
  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin:       [10, 10],
      filename:     `AI_Portfolio_${userProfile.age}_${userProfile.investmentGoal}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }
  // ---------------------------

  const generateRecommendations = async () => {
    setLoading(true)
    
    try {
      // Call your backend API that uses AI
      const response = await axios.post('http://localhost:5000/api/ai-fund-recommendations', {
        profile: userProfile
      })
      
      setRecommendations(response.data)
      setStep(3)
    } catch (error) {
      console.error('Error getting recommendations:', error)
      alert('Failed to get AI recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetPicker = () => {
    setStep(1)
    setRecommendations(null)
    setUserProfile({
      age: '',
      monthlyIncome: '',
      investmentAmount: '',
      investmentHorizon: '',
      riskTolerance: '',
      investmentGoal: '',
      existingInvestments: '',
      expectedReturns: ''
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="font-bold">AI-Powered Recommendations</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🤖 AI Mutual Fund Picker
        </h1>
        <p className="text-lg text-gray-600">
          Get personalized fund recommendations powered by Artificial Intelligence
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-semibold hidden md:inline">Your Profile</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full transition-all duration-300 ${step >= 2 ? 'bg-indigo-600 w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-semibold hidden md:inline">Preferences</span>
          </div>
          <div className="w-16 h-1 bg-gray-200">
            <div className={`h-full transition-all duration-300 ${step >= 3 ? 'bg-indigo-600 w-full' : 'w-0'}`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-semibold hidden md:inline">Recommendations</span>
          </div>
        </div>
      </div>

      {/* Step 1: Basic Profile */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Tell Us About Yourself</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Age
              </label>
              <input
                type="number"
                value={userProfile.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                value={userProfile.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Investment Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                How much do you want to invest? (₹)
              </label>
              <input
                type="number"
                value={userProfile.investmentAmount}
                onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                placeholder="e.g., 10000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Investment Horizon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Time Horizon
              </label>
              <select
                value={userProfile.investmentHorizon}
                onChange={(e) => handleInputChange('investmentHorizon', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select duration</option>
                <option value="1-3 years">1-3 years (Short term)</option>
                <option value="3-5 years">3-5 years (Medium term)</option>
                <option value="5-10 years">5-10 years (Long term)</option>
                <option value="10+ years">10+ years (Very long term)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(2)}
              disabled={!userProfile.age || !userProfile.monthlyIncome || !userProfile.investmentAmount || !userProfile.investmentHorizon}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next Step
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Investment Preferences */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Your Investment Preferences</h2>
          
          <div className="space-y-6">
            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Risk Tolerance
              </label>
              <div className="grid md:grid-cols-4 gap-3">
                {['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => handleInputChange('riskTolerance', risk)}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      userProfile.riskTolerance === risk
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Primary Investment Goal
              </label>
              <div className="grid md:grid-cols-3 gap-3">
                {['Wealth Creation', 'Retirement Planning', 'Child Education', 'Tax Saving', 'Emergency Fund', 'Other'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleInputChange('investmentGoal', goal)}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      userProfile.investmentGoal === goal
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing Investments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Do you have existing mutual fund investments?
              </label>
              <select
                value={userProfile.existingInvestments}
                onChange={(e) => handleInputChange('existingInvestments', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select an option</option>
                <option value="No">No, I'm a beginner</option>
                <option value="Yes, small">Yes, small portfolio (under ₹1 lakh)</option>
                <option value="Yes, medium">Yes, medium portfolio (₹1-5 lakhs)</option>
                <option value="Yes, large">Yes, large portfolio (above ₹5 lakhs)</option>
              </select>
            </div>

            {/* Expected Returns */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expected Annual Returns
              </label>
              <select
                value={userProfile.expectedReturns}
                onChange={(e) => handleInputChange('expectedReturns', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select expected returns</option>
                <option value="8-10%">8-10% (Conservative)</option>
                <option value="10-12%">10-12% (Moderate)</option>
                <option value="12-15%">12-15% (Moderate-High)</option>
                <option value="15%+">15%+ (Aggressive)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </button>
            <button
              onClick={generateRecommendations}
              disabled={!userProfile.riskTolerance || !userProfile.investmentGoal || !userProfile.existingInvestments || !userProfile.expectedReturns}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get AI Recommendations
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-xl p-16 mb-6">
          <div className="text-center">
            <div className="inline-block relative">
              <div className="w-24 h-24 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
              AI is analyzing your profile...
            </h3>
            <p className="text-gray-600">
              Creating personalized fund recommendations based on your goals and risk profile
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: AI Recommendations */}
      {step === 3 && recommendations && (
        <div className="space-y-6" ref={reportRef}> {/* Added ref here */}
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Your Personalized Portfolio</h2>
                <p className="text-indigo-100">
                  Based on your profile: {userProfile.age} years old, {userProfile.riskTolerance} risk tolerance
                </p>
              </div>
              <button
                onClick={resetPicker}
                data-html2canvas-ignore="true" // Hides button from PDF
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-semibold transition-all"
              >
                Start Over
              </button>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-sm text-indigo-200">Investment Amount</div>
                <div className="text-2xl font-bold">₹{parseInt(userProfile.investmentAmount).toLocaleString()}</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-sm text-indigo-200">Time Horizon</div>
                <div className="text-2xl font-bold">{userProfile.investmentHorizon}</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-sm text-indigo-200">Goal</div>
                <div className="text-2xl font-bold">{userProfile.investmentGoal}</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-sm text-indigo-200">Expected Returns</div>
                <div className="text-2xl font-bold">{userProfile.expectedReturns}</div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Analysis & Insights
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-indigo-600">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {recommendations.analysis}
              </p>
            </div>
          </div>

          {/* Recommended Funds */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🎯 Recommended Mutual Funds
            </h3>
            <div className="space-y-4">
              {recommendations.funds.map((fund, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <h4 className="text-xl font-bold text-gray-800">{fund.name}</h4>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {fund.category}
                        </span>
                        <span className="text-gray-600 text-sm">{fund.fundHouse}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Allocation</div>
                      <div className="text-3xl font-bold text-indigo-600">{fund.allocation}%</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ₹{((userProfile.investmentAmount * fund.allocation) / 100).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Why this fund?</h5>
                    <p className="text-sm text-gray-700">{fund.reason}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-700 font-semibold">3Y Returns</div>
                      <div className="text-lg font-bold text-green-800">{fund.returns3Y}%</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs text-orange-700 font-semibold">Risk Level</div>
                      <div className="text-lg font-bold text-orange-800">{fund.risk}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs text-purple-700 font-semibold">Expense Ratio</div>
                      <div className="text-lg font-bold text-purple-800">{fund.expenseRatio}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Breakdown */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Portfolio Allocation</h3>
            <div className="space-y-3">
              {recommendations.funds.map((fund, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">{fund.name}</span>
                    <span className="font-bold text-indigo-600">{fund.allocation}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${fund.allocation}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-bold text-yellow-900 mb-2">Important Disclaimer</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• These recommendations are AI-generated and for informational purposes only</li>
                  <li>• This is NOT financial advice. Please consult a SEBI-registered advisor before investing</li>
                  <li>• Past performance is not indicative of future returns</li>
                  <li>• Mutual fund investments are subject to market risks</li>
                  <li>• Always read scheme documents carefully before investing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4" data-html2canvas-ignore="true"> {/* Hidden from PDF */}
            <button
              onClick={resetPicker}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Try Different Profile
            </button>
            <button
              onClick={handleDownloadPDF} // Trigger PDF Function
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Portfolio PDF
            </button>
          </div>
        </div>
      )}

      {/* Feature Highlights */}
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">Advanced algorithms analyze your profile to suggest optimal funds</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Risk-Matched Portfolio</h3>
            <p className="text-sm text-gray-600">Get funds that match your risk tolerance and investment goals</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Personalized Allocation</h3>
            <p className="text-sm text-gray-600">Receive exact percentage allocation for each recommended fund</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIFundPicker