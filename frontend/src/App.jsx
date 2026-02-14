import { useState } from 'react'
import MutualFundsList from './components/MutualFundsList'
import SIPCalculator from './components/SIPCalculator'
import LearnMutualFunds from './components/LearnMutualFunds'

function App() {
  const [activeTab, setActiveTab] = useState('funds')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            💰 Mutual Fund Analysis
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Explore mutual funds and calculate your SIP returns
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab('funds')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'funds'
                ? 'bg-white text-indigo-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            📊 Mutual Funds
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'calculator'
                ? 'bg-white text-indigo-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🧮 SIP Calculator
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === 'learn'
                ? 'bg-white text-indigo-600 shadow-xl scale-105'
                : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            🎓 Learn
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          {activeTab === 'funds' && <MutualFundsList />}
          {activeTab === 'calculator' && <SIPCalculator />}
          {activeTab === 'learn' && <LearnMutualFunds />}
        </div>
      </div>
    </div>
  )
}

export default App