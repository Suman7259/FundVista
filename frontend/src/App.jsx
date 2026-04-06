import { useState } from 'react'
import MutualFundsList from './components/MutualFundsList'
import SIPCalculator from './components/SIPCalculator'
import LearnMutualFunds from './components/LearnMutualFunds'
import MarketIndices from './components/MarketIndices'

function App() {
  const [activeTab, setActiveTab] = useState('funds')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Market Indices Bar - Sticky at top */}
      <MarketIndices />

      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold mb-2">NaviGate</h1>
          <p className="text-indigo-100">Your Smart Mutual Fund Analysis Platform</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-10 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('funds')}
              className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 ${
                activeTab === 'funds'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              📊 Mutual Funds
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 ${
                activeTab === 'calculator'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              🧮 SIP Calculator
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className={`px-6 py-4 font-semibold transition-all duration-300 border-b-4 ${
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
        {activeTab === 'funds' && <MutualFundsList />}
        {activeTab === 'calculator' && <SIPCalculator />}
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
              © 2026 NaviGate - Mutual Fund Analysis Platform | Data from MFapi.in
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App