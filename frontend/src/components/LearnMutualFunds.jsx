import { useState } from 'react'

const LearnMutualFunds = () => {
  const [activeCategory, setActiveCategory] = useState('basics')
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(null)

  // FIX: This function ensures any YouTube link is converted to the valid embed format
  const formatEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    
    // Handle youtu.be share links
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } 
    // Handle standard watch?v= links
    else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    // Handle existing embed links
    else if (url.includes('embed/')) {
      return url;
    }

    return `https://www.youtube.com/embed/${videoId}`;
  }

  const educationalContent = {
    basics: {
      title: "📚 Mutual Funds Basics",
      icon: "📚",
      videos: [
        {
          title: "What are Mutual Funds? Complete Guide",
          // This was a share link - the formatter will now handle this
          url: "https://youtu.be/ACpQo1a_RBk?si=kKeiXHnYrcLSojew",
          duration: "15:30",
          channel: "Ankur Warikoo"
        },
        {
          title: "How Mutual Funds Work - Explained Simply",
          url: "https://youtu.be/OuYvU5m2rhQ?si=_u7lx4jfRq6E9COJ",
          duration: "12:45",
          channel: "Zerodha Varsity"
        },
        {
          title: "Understanding NAV in Mutual Funds",
          url: "https://youtu.be/UD2s3RRvW3A?si=UKHrQf1TxxosTt9B",
          duration: "8:20",
          channel: "Zerodha Varsity"
        }
      ],
      topics: [
        {
          question: "What is a Mutual Fund?",
          answer: "A mutual fund is a professionally managed investment vehicle that pools money from multiple investors to invest in stocks, bonds, or other securities. It's managed by professional fund managers who make investment decisions on behalf of investors."
        },
        {
          question: "How do Mutual Funds work?",
          answer: "When you invest in a mutual fund, you buy units of the fund. The price of each unit is called NAV (Net Asset Value). As the fund's investments grow, the NAV increases, giving you returns on your investment. Fund managers actively manage the portfolio by buying and selling securities."
        },
        {
          question: "What is NAV (Net Asset Value)?",
          answer: "NAV is the per-unit market value of a mutual fund. It's calculated by dividing the total value of all securities in the portfolio, minus liabilities, by the total number of outstanding units. NAV is updated daily based on the closing market prices."
        },
        {
          question: "Why invest in Mutual Funds?",
          answer: "Mutual funds offer professional management, diversification, liquidity, affordability, and tax benefits. They're ideal for investors who want market exposure without managing individual stocks themselves."
        }
      ]
    },
    types: {
      title: "📊 Types of Mutual Funds",
      icon: "📊",
      videos: [
        {
          title: "Types of Mutual Funds Explained",
          url: "https://youtu.be/ryT8f9wl4DY?si=5n9AbJoyReyN0yYO",
          duration: "18:45",
          channel: "Sanjay Kathuria"
        },
        {
          title: "Large Cap vs Mid Cap vs Small Cap",
          url: "https://youtu.be/pmmAPaDyENw?si=YlxrlWmvBd_eQIU3",
          duration: "14:20",
          channel: "Labour Law Advisor"
        },
        {
          title: "Index Funds vs Actively Managed Funds",
          url: "https://www.youtube.com/embed/fvGLnthJDsg",
          duration: "16:30",
          channel: "Pranjal Kamra"
        }
      ],
      topics: [
        {
          question: "Large Cap Funds",
          answer: "Invest primarily in large, well-established companies with market capitalization typically above ₹20,000 crores. These are considered relatively stable with moderate returns and lower risk. Ideal for conservative investors.",
          risk: "Moderate",
          returns: "10-15% annually",
          suitable: "Conservative to moderate investors"
        },
        {
          question: "Mid Cap Funds",
          answer: "Invest in medium-sized companies with market cap between ₹5,000 to ₹20,000 crores. These offer higher growth potential than large caps but come with higher volatility. Good for investors with moderate risk appetite.",
          risk: "High",
          returns: "12-18% annually",
          suitable: "Moderate to aggressive investors"
        },
        {
          question: "Small Cap Funds",
          answer: "Invest in smaller companies with market cap below ₹5,000 crores. These have the highest growth potential but also the highest risk and volatility. Best for long-term aggressive investors.",
          risk: "Very High",
          returns: "15-25% annually",
          suitable: "Aggressive, long-term investors"
        },
        {
          question: "Index Funds",
          answer: "Passively managed funds that track a specific market index like Nifty 50 or Sensex. They have lower expense ratios and provide market returns. Ideal for passive investors who believe in long-term market growth.",
          risk: "Moderate",
          returns: "Market returns (10-13%)",
          suitable: "Passive, long-term investors"
        },
        {
          question: "Flexi Cap Funds",
          answer: "Can invest across large, mid, and small cap stocks without restrictions. Fund managers have flexibility to shift allocation based on market conditions. Offers good diversification.",
          risk: "Moderate to High",
          returns: "12-16% annually",
          suitable: "Investors seeking diversification"
        },
        {
          question: "Gold Funds",
          answer: "Invest in gold or gold-related securities. They track gold prices and serve as a hedge against inflation. Good for portfolio diversification and during economic uncertainty.",
          risk: "Low to Moderate",
          returns: "8-12% (based on gold prices)",
          suitable: "Risk-averse investors, diversification"
        }
      ]
    },
    sip: {
      title: "💰 SIP (Systematic Investment Plan)",
      icon: "💰",
      videos: [
        {
          title: "SIP Explained - Complete Guide for Beginners",
          url: "https://youtu.be/1DRq8N7SpYc?si=k7PTFfrWxLeiFyLI",
          duration: "20:15",
          channel: "Groww"
        },
        {
          title: "Power of Compounding in SIP",
          url: "https://youtu.be/cosjtcWyWlI?si=a6OmGMVEDH0mSwHX",
          duration: "11:30",
          channel: "Shashank Udupa"
        },
        {
          title: "SIP vs Lumpsum - Which is Better?",
          url: "https://youtu.be/1DRq8N7SpYc?si=YM7QIPDUdwLN8EXv",
          duration: "13:45",
          channel: "ETMONEY"
        }
      ],
      topics: [
        {
          question: "What is SIP?",
          answer: "SIP is a method of investing a fixed amount regularly (monthly/quarterly) in mutual funds. Instead of investing a lump sum, you invest small amounts consistently over time, making it easier to build wealth gradually."
        },
        {
          question: "Benefits of SIP",
          answer: "1. Rupee Cost Averaging: Buy more units when prices are low and fewer when high\n2. Power of Compounding: Returns generate their own returns over time\n3. Disciplined Investing: Regular investment habit\n4. Affordability: Start with as low as ₹500\n5. Flexibility: Can increase, decrease, or pause anytime"
        },
        {
          question: "How does Rupee Cost Averaging work?",
          answer: "When markets are down, your fixed SIP amount buys more units. When markets are up, it buys fewer units. Over time, this averages out your purchase cost, reducing the impact of market volatility."
        },
        {
          question: "Power of Compounding in SIP",
          answer: "Compounding means earning returns on your returns. For example, investing ₹5,000 monthly for 20 years at 12% returns can grow to over ₹50 lakhs, where you invested only ₹12 lakhs. The remaining ₹38+ lakhs is from compounding!"
        },
        {
          question: "SIP vs Lumpsum",
          answer: "SIP: Regular small investments, reduces market timing risk, better for salaried individuals\nLumpsum: One-time large investment, good when you have surplus funds, higher returns if market timing is right\n\nBest approach: Combine both - SIP for regular income and lumpsum for bonuses/windfalls"
        }
      ]
    },
    returns: {
      title: "📈 Understanding Returns & Risks",
      icon: "📈",
      videos: [
        {
          title: "Understanding Mutual Fund Returns",
          url: "https://youtu.be/8A3s9WP_7l4?si=a21d74B3TOWJskaZ",
          duration: "15:20",
          channel: "Finance Boosan"
        },
        {
          title: "What is Expense Ratio?",
          url: "https://youtu.be/FaisQZ3bRPY?si=r2XoahPALKEjsB9A",
          duration: "9:45",
          channel: "Akshat Shrivastava"
        },
        {
          title: "Risk Management in Mutual Funds",
          url: "https://youtu.be/7ctmsSRGGsk?si=KYZiKnMVrJ3bWPYm",
          duration: "17:30",
          channel: "Shankar Nath"
        }
      ],
      topics: [
        {
          question: "What are Absolute Returns?",
          answer: "Absolute return is the simple percentage gain or loss on your investment. Formula: [(Current Value - Investment) / Investment] × 100\n\nExample: Invested ₹10,000, current value ₹12,000\nAbsolute Return = [(12,000 - 10,000) / 10,000] × 100 = 20%"
        },
        {
          question: "What is CAGR (Annualized Returns)?",
          answer: "CAGR (Compound Annual Growth Rate) shows the annual growth rate of your investment over time. It smoothens out volatility and gives a clearer picture of long-term performance.\n\nCAGR is always shown for 1 year, 3 years, and 5 years in fund factsheets."
        },
        {
          question: "What is Expense Ratio?",
          answer: "Expense ratio is the annual fee charged by the fund house for managing your money. It's expressed as a percentage of assets.\n\nExample: 1% expense ratio means ₹100 fee on ₹10,000 investment annually.\n\nLower is better! Index funds typically have 0.1-0.5%, while actively managed funds have 1-2.5%."
        },
        {
          question: "Understanding Risk Levels",
          answer: "Low Risk: Debt funds, liquid funds (returns 4-7%)\nModerate Risk: Large cap, index funds (returns 10-13%)\nHigh Risk: Mid cap, flexi cap (returns 12-18%)\nVery High Risk: Small cap (returns 15-25%)\n\nHigher risk = Higher potential returns + Higher potential losses\n\nRule: Match risk with your investment horizon. Long-term = can take higher risk."
        },
        {
          question: "What is Standard Deviation?",
          answer: "Standard deviation measures volatility - how much returns fluctuate from average. Higher standard deviation = more volatile fund.\n\nExample: Fund A returns: 10%, 11%, 12% (Low SD - stable)\nFund B returns: 5%, 20%, 8% (High SD - volatile)\n\nIf you're risk-averse, choose funds with lower standard deviation."
        }
      ]
    },
    investment: {
      title: "🎯 Investment Strategies",
      icon: "🎯",
      videos: [
        {
          title: "Asset Allocation Strategy",
          url: "https://youtu.be/LTe0xl8LZuA?si=U440YWt2xZF8cwQJ",
          duration: "19:30",
          channel: "Yadnya Investment Academy"
        },
        {
          title: "When to Buy and Sell Mutual Funds",
          url: "https://youtu.be/aBvcg66gENc?si=SKiKbnrDzGIa0DpL",
          duration: "14:15",
          channel: "Ankur Warikoo"
        },
        {
          title: "Portfolio Diversification Guide",
          url: "https://youtu.be/iOCbdCHtP4M?si=SC6IyUDRKuOiQD_d",
          duration: "16:40",
          channel: "CA Rachana Ranade"
        }
      ],
      topics: [
        {
          question: "How much should I invest?",
          answer: "Follow the 50-30-20 rule:\n• 50% for needs (rent, food, bills)\n• 30% for wants (entertainment, shopping)\n• 20% for savings and investments\n\nStart with at least 10-15% of monthly income in mutual funds. Increase gradually as income grows."
        },
        {
          question: "Asset Allocation Strategy",
          answer: "Don't put all eggs in one basket! Diversify across:\n\n• 40-50% Large cap (stability)\n• 20-30% Mid cap (growth)\n• 10-15% Small cap (high growth)\n• 10-15% Debt/Gold (safety)\n• 5-10% International (global exposure)\n\nAdjust based on age: Equity % = 100 - your age"
        },
        {
          question: "When to invest? (Market Timing)",
          answer: "Don't try to time the market! Best approach:\n\n1. Start SIP immediately - don't wait for 'right time'\n2. Market down? Great time for lumpsum\n3. Market high? Continue SIP, avoid large lumpsum\n4. Consistency beats timing\n\n'Time in the market > Timing the market'"
        },
        {
          question: "Investment Horizon Guide",
          answer: "Short-term (1-3 years): Debt funds, liquid funds\nMedium-term (3-5 years): Hybrid funds, balanced funds, large cap\nLong-term (5+ years): Equity funds (mid, small cap, flexi cap)\n\nRule: Never invest in equity if you need money within 3 years!"
        },
        {
          question: "When to Exit/Redeem?",
          answer: "Exit when:\n• Goal achieved (child education, house down payment)\n• Consistent underperformance (below benchmark for 2+ years)\n• Fund manager change (affects strategy)\n• Fundamental changes in fund strategy\n\nDON'T exit just because:\n• Market is down (temporary)\n• Short-term underperformance\n• Panic during corrections"
        }
      ]
    },
    tax: {
      title: "💵 Taxation & Regulations",
      icon: "💵",
      videos: [
        {
          title: "Mutual Fund Taxation Explained (2024 Update)",
          url: "https://youtu.be/zxSwhkoQvO8?si=fq0os69sP3XRuE2R",
          duration: "21:45",
          channel: "Labour Law Advisor"
        },
        {
          title: "ELSS Tax Saving Mutual Funds",
          url: "https://youtu.be/rmZcZiPUuYI?si=maT732bog9SsXFkz",
          duration: "13:20",
          channel: "Groww"
        },
        {
          title: "Direct vs Regular Mutual Funds",
          url: "https://youtu.be/5uaWzV55v0Y?si=CwYz6Rcx9qmAF_WX",
          duration: "10:30",
          channel: "Zerodha"
        }
      ],
      topics: [
        {
          question: "How are Equity Funds Taxed?",
          answer: "Long-term Capital Gains (LTCG):\n• Holding period: >1 year\n• Tax: 10% on gains above ₹1 lakh annually\n• No indexation benefit\n\nShort-term Capital Gains (STCG):\n• Holding period: <1 year\n• Tax: 15% flat\n\nDividends: Taxed at your income tax slab rate"
        },
        {
          question: "How are Debt Funds Taxed?",
          answer: "From April 2023, all debt fund gains are taxed as per your income tax slab, regardless of holding period.\n\nPreviously, LTCG (>3 years) had indexation benefit, but that's removed now.\n\nThis makes debt funds less tax-efficient than before."
        },
        {
          question: "What is ELSS (Tax Saving Funds)?",
          answer: "ELSS (Equity Linked Savings Scheme):\n• Invest in equity funds\n• Get tax deduction up to ₹1.5 lakh under Section 80C\n• Lock-in period: 3 years (shortest among 80C options)\n• Returns: 12-15% historically\n\nBetter than PPF/FD for long-term wealth creation!"
        },
        {
          question: "What is Exit Load?",
          answer: "Exit load is a fee charged when you redeem units before a certain period.\n\nTypical structure:\n• Equity funds: 1% if redeemed within 1 year\n• Debt funds: 0.5-1% if redeemed within 1-3 months\n• No exit load after the specified period\n\nCheck fund documents before investing!"
        },
        {
          question: "Direct vs Regular Plans",
          answer: "Direct Plans:\n• Buy directly from AMC\n• No distributor commission\n• Lower expense ratio (0.5-1% less)\n• Higher returns over time\n\nRegular Plans:\n• Through distributors/advisors\n• Higher expense ratio\n• Lower returns\n\nRecommendation: Choose Direct plans if you can research yourself. Use Regular only if you need hand-holding."
        }
      ]
    }
  }

  const categories = [
    { id: 'basics', label: 'Basics', icon: '📚' },
    { id: 'types', label: 'Fund Types', icon: '📊' },
    { id: 'sip', label: 'SIP', icon: '💰' },
    { id: 'returns', label: 'Returns & Risk', icon: '📈' },
    { id: 'investment', label: 'Strategies', icon: '🎯' },
    { id: 'tax', label: 'Tax & Rules', icon: '💵' }
  ]

  const openVideo = (video) => {
    setCurrentVideo(video)
    setShowVideo(true)
  }

  const closeVideo = () => {
    setShowVideo(false)
    setCurrentVideo(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎓 Learn About Mutual Funds
        </h1>
        <p className="text-lg text-gray-600">
          Everything you need to know to start your investment journey
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Video Section */}
      {educationalContent[activeCategory].videos && (
        <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🎥</span>
            Video Tutorials
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {educationalContent[activeCategory].videos.map((video, index) => (
              <div
                key={index}
                onClick={() => openVideo(video)}
                className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-red-300"
              >
                <div className="relative mb-3">
                  <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-lg h-32 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{video.title}</h4>
                <p className="text-sm text-gray-600">{video.channel}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">{educationalContent[activeCategory].icon}</span>
          {educationalContent[activeCategory].title}
        </h2>

        <div className="space-y-6">
          {educationalContent[activeCategory].topics.map((topic, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border-l-4 border-indigo-500 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {topic.question}
              </h3>
              
              <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                {topic.answer}
              </p>

              {topic.risk && (
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-xs text-yellow-700 font-semibold mb-1">Risk Level</div>
                    <div className="text-sm font-bold text-yellow-800">{topic.risk}</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs text-green-700 font-semibold mb-1">Expected Returns</div>
                    <div className="text-sm font-bold text-green-800">{topic.returns}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-xs text-blue-700 font-semibold mb-1">Suitable For</div>
                    <div className="text-sm font-bold text-blue-800">{topic.suitable}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">📚 Want to Learn More?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl mb-3">📖</div>
            <h4 className="font-bold mb-2">Read Official Guides</h4>
            <p className="text-sm text-indigo-100">Check SEBI and AMFI websites for detailed mutual fund guidelines</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl mb-3">🎥</div>
            <h4 className="font-bold mb-2">Watch Tutorials</h4>
            <p className="text-sm text-indigo-100">YouTube channels like Zerodha Varsity, ET Money offer great content</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-3xl mb-3">💬</div>
            <h4 className="font-bold mb-2">Consult Experts</h4>
            <p className="text-sm text-indigo-100">Talk to certified financial planners for personalized advice</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Disclaimer:</strong> This information is for educational purposes only. 
          Mutual fund investments are subject to market risks. Past performance is not indicative of future returns. 
          Please read scheme documents carefully before investing. Consult a financial advisor for personalized advice.
        </p>
      </div>

      {/* Video Modal */}
      {showVideo && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">{currentVideo.title}</h3>
                <p className="text-red-100 text-sm">{currentVideo.channel}</p>
              </div>
              <button
                onClick={closeVideo}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                // MODIFIED: We pass the URL through the format function here
                src={formatEmbedUrl(currentVideo.url)}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearnMutualFunds