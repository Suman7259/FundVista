import { useState, createContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import MutualFundsList from './components/MutualFundsList'
import SIPCalculator from './components/SIPCalculator'
import LearnMutualFunds from './components/LearnMutualFunds'
import AIFundPicker from './components/AIFundPicker'
import MarketIndices from './components/MarketIndices'
import VirtualPortfolio from './components/VirtualPortfolio'
import AuthPage from './components/AuthPage'
import UserProfile from './components/UserProfile'
import Dashboard from './components/Dashboard'

// Create context for investment mode
export const InvestmentModeContext = createContext()

function App() {
  const { isLoading, isAuthenticated } = useAuth0()
  const [investmentMode, setInvestmentMode] = useState('virtual')
  const [activeTab, setActiveTab] = useState('dashboard') // Changed from 'funds' to 'dashboard'

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading NaviGate...</p>
        </div>
      </div>
    )
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />
  }

  // Main app (only shown when authenticated)
  return (
    <InvestmentModeContext.Provider value={{ investmentMode, setInvestmentMode }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Market Indices Bar */}
        <MarketIndices />

        {/* Header with User Profile */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">FundVista</h1>
                <p className="text-indigo-100">Your Smart Mutual Fund Analysis Platform</p>
              </div>
              <UserProfile />
            </div>
          </div>
        </header>

        {/* Investment Mode Toggle */}
        <div className="bg-white shadow-md sticky top-10 z-40 border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-4">
              <span className="text-gray-600 font-semibold">Investment Mode:</span>
              <button
                onClick={() => setInvestmentMode('virtual')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  investmentMode === 'virtual'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🎮 Virtual Mode (Demo)
              </button>
              <button
                onClick={() => setInvestmentMode('real')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  investmentMode === 'real'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💰 Real Investment
              </button>
            </div>
            {investmentMode === 'virtual' && (
              <p className="text-center text-sm text-indigo-600 mt-2">
                ✨ Practice investing with ₹1,00,000 virtual money - No real money involved
              </p>
            )}
            {investmentMode === 'real' && (
              <p className="text-center text-sm text-green-600 mt-2">
                🔗 Invest through trusted platforms (Groww, Zerodha, etc.)
              </p>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
<nav className="bg-white shadow-md sticky top-[118px] z-30">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex gap-1 overflow-x-auto">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap ${
          activeTab === 'dashboard'
            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        🏠 Dashboard
      </button>
      <button
        onClick={() => setActiveTab('funds')}
        className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap ${
          activeTab === 'funds'
            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        📊 Mutual Funds
      </button>
      {investmentMode === 'virtual' && (
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
              : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          💼 My Portfolio
        </button>
      )}
      <button
        onClick={() => setActiveTab('calculator')}
        className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap ${
          activeTab === 'calculator'
            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        🧮 SIP Calculator
      </button>
      <button
        onClick={() => setActiveTab('ai-picker')}
        className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap flex items-center gap-2 ${
          activeTab === 'ai-picker'
            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        🤖 AI Fund Picker
        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded-full">AI</span>
      </button>
      <button
        onClick={() => setActiveTab('learn')}
        className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 whitespace-nowrap ${
          activeTab === 'learn'
            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
        }`}
      >
        🎓 Learn
      </button>
    </div>
  </div>
</nav>

{/* Main Content */}
<main className="max-w-7xl mx-auto px-4 py-8">
  {activeTab === 'dashboard' && <Dashboard />}
  {activeTab === 'funds' && <MutualFundsList />}
  {activeTab === 'portfolio' && <VirtualPortfolio />}
  {activeTab === 'calculator' && <SIPCalculator />}
  {activeTab === 'ai-picker' && <AIFundPicker />}
  {activeTab === 'learn' && <LearnMutualFunds />}
</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                ⚠️ <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. 
                Read all scheme-related documents carefully before investing. Past performance is not 
                indicative of future returns. This platform is for informational purposes only.
              </p>
              <p className="text-gray-500 text-sm">
                © 2026 NaviGate - Mutual Fund Analysis Platform | Data from MFapi.in | AI Powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>
        </footer>
      </div>
    </InvestmentModeContext.Provider>
  )
}

export default App