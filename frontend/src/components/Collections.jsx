import { useState } from 'react'

const Collections = ({ onCategorySelect }) => {
  const collections = [
    {
      id: 'large-cap',
      category: 'Large Cap',
      title: 'Large Cap',
      description: 'Stable blue-chip companies',
      icon: '🏢',
      gradient: 'from-blue-400 to-blue-600',
      image: '🏛️'
    },
    {
      id: 'mid-cap',
      category: 'Mid Cap',
      title: 'Mid Cap',
      description: 'High growth potential',
      icon: '📈',
      gradient: 'from-orange-400 to-orange-600',
      image: '🏗️'
    },
    {
      id: 'small-cap',
      category: 'Small Cap',
      title: 'Small Cap',
      description: 'Emerging opportunities',
      icon: '🚀',
      gradient: 'from-red-400 to-red-600',
      image: '🌱'
    },
    {
      id: 'index',
      category: 'Index Fund',
      title: 'Index Funds',
      description: 'Track market indices',
      icon: '📊',
      gradient: 'from-green-400 to-green-600',
      image: '📉'
    },
    {
      id: 'flexi',
      category: 'Flexi Cap',
      title: 'Flexi Cap',
      description: 'Flexible allocation',
      icon: '🎯',
      gradient: 'from-purple-400 to-purple-600',
      image: '⚖️'
    },
    {
      id: 'gold',
      category: 'Gold Fund',
      title: 'Gold & Silver',
      description: 'Precious metals investment',
      icon: '🥇',
      gradient: 'from-yellow-400 to-yellow-600',
      image: '💰'
    }
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Collections</h2>
      <p className="text-gray-600 mb-8">Explore funds by category</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => onCategorySelect(collection.category)}
            className="group cursor-pointer"
          >
            <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Image/Icon Container */}
              <div className={`w-full h-32 bg-gradient-to-br ${collection.gradient} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
                
                {/* Main Icon/Image */}
                <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                  {collection.image}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-800 text-center mb-1">
                {collection.title}
              </h3>
              
              {/* Description */}
              <p className="text-xs text-gray-500 text-center">
                {collection.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500 rounded-2xl transition-colors duration-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Collections