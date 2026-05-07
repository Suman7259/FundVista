import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Dashboard = () => {
  const { user, logout } = useAuth0()
  const [activeSection, setActiveSection] = useState('overview')

  // Get portfolio stats from localStorage
  const portfolio = JSON.parse(localStorage.getItem('virtualPortfolio') || '[]')
  const balance = parseFloat(localStorage.getItem('virtualBalance') || '100000')
  const totalInvested = parseFloat(localStorage.getItem('totalInvested') || '0')
  const currentValue = portfolio.reduce((sum, item) => sum + (item.units * item.currentNAV), 0)
  const totalReturns = currentValue - totalInvested
  const returnsPercent = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name?.split(' ')[0]}! 👋</h1>
              <p className="text-indigo-100 mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Member since {new Date(user.updated_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ Verified
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeSection === 'overview'
                ? 'bg-indigo-50 text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeSection === 'profile'
                ? 'bg-indigo-50 text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveSection('activity')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeSection === 'activity'
                ? 'bg-indigo-50 text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📈 Activity
          </button>
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Portfolio Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-semibold">Available Balance</div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">₹{balance.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Virtual money</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-semibold">Total Invested</div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">₹{totalInvested.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Across {portfolio.length} funds</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-semibold">Current Value</div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">₹{Math.round(currentValue).toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Portfolio value</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-semibold">Total Returns</div>
                <div className={`w-10 h-10 ${totalReturns >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={totalReturns >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                  </svg>
                </div>
              </div>
              <div className={`text-3xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturns >= 0 ? '+' : ''}₹{Math.round(totalReturns).toLocaleString()}
              </div>
              <div className={`text-xs mt-1 font-semibold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returnsPercent >= 0 ? '+' : ''}{returnsPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold">New Investment</div>
                  <div className="text-sm text-indigo-100">Browse funds</div>
                </div>
              </button>

              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold">AI Picker</div>
                  <div className="text-sm text-green-100">Get recommendations</div>
                </div>
              </button>

              <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all flex items-center gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold">Learn</div>
                  <div className="text-sm text-orange-100">Educational resources</div>
                </div>
              </button>
            </div>
          </div> */}

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Investments</h2>
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">No investments yet. Start investing to see your activity!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {portfolio.slice(0, 5).map((investment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{investment.fundName.split('-')[0].trim()}</div>
                        <div className="text-sm text-gray-500">{new Date(investment.date).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">₹{investment.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{investment.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-8 mb-8">
              <img
                src={user.picture}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-indigo-100 shadow-lg"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user.email_verified ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Email Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ⚠ Email Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Full Name</div>
                <div className="font-semibold text-gray-800">{user.name}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Email Address</div>
                <div className="font-semibold text-gray-800">{user.email}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">User ID</div>
                <div className="font-semibold text-gray-800 text-sm">{user.sub}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                <div className="font-semibold text-gray-800">
                  {new Date(user.updated_at).toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">Investment Mode</div>
                  <div className="text-sm text-gray-600">Currently using virtual money</div>
                </div>
                <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold">
                  Virtual Mode
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-800">Total Investments</div>
                  <div className="text-sm text-gray-600">Number of active positions</div>
                </div>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold">
                  {portfolio.length} Funds
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div>
                  <div className="font-semibold text-red-800">Logout</div>
                  <div className="text-sm text-red-600">Sign out of your account</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Section */}
      {activeSection === 'activity' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Investment Activity</h2>
          
          {portfolio.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Activity Yet</h3>
              <p className="text-gray-600">Start investing to see your activity timeline here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {portfolio.map((investment, index) => {
                const returns = (investment.units * investment.currentNAV) - investment.amount
                const returnsPercent = ((investment.currentNAV - investment.buyNAV) / investment.buyNAV) * 100

                return (
                  <div key={index} className="border-l-4 border-indigo-500 pl-6 py-4 relative">
                    <div className="absolute left-0 top-4 w-4 h-4 bg-indigo-500 rounded-full -ml-2"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-800 mb-1">{investment.fundName}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {investment.type} • {new Date(investment.date).toLocaleDateString('en-IN', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            Amount: ₹{investment.amount.toLocaleString()}
                          </span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            Units: {investment.units}
                          </span>
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            NAV: ₹{investment.buyNAV.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {returns >= 0 ? '+' : ''}₹{Math.round(returns).toLocaleString()}
                        </div>
                        <div className={`text-sm font-semibold ${returnsPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {returnsPercent >= 0 ? '+' : ''}{returnsPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard