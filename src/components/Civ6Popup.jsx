import React, { useEffect, useState } from 'react'
import './Civ6Popup.css'

const Civ6Popup = ({ data, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation
  }

  const getBuildingIcon = (type) => {
    switch (type) {
      case 'Mid-Front-Garage Homes':
        return '🏠'
      case 'Parked Semi-Detached Homes':
        return '🏘️'
      case 'Natural Reserve':
        return '🌲'
      case 'Waterfront':
        return '🌊'
      default:
        return '📍'
    }
  }

  const getForecastColor = (forecast) => {
    if (forecast.includes('+')) {
      return '#4CAF50' // Green for positive growth
    } else if (forecast.includes('Premium')) {
      return '#FF9800' // Orange for premium
    }
    return '#757575' // Gray for neutral
  }

  return (
    <div className="popup-overlay">
      <div 
        className={`civ6-popup ${isVisible ? 'visible' : ''}`}
        style={{
          left: Math.min(data.position?.x || 100, window.innerWidth - 320),
          top: Math.min(data.position?.y || 100, window.innerHeight - 400)
        }}
      >
        <div className="popup-header">
          <div className="popup-title-section">
            <div className="building-icon">
              {getBuildingIcon(data.subtitle)}
            </div>
            <div className="title-text">
              <h2 className="popup-title">{data.title}</h2>
              <p className="popup-subtitle">{data.subtitle}</p>
            </div>
          </div>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <div className="popup-content">
          <div className="description-section">
            <p className="description">{data.description}</p>
          </div>

          <div className="forecast-section">
            <div className="forecast-label">Price Forecast</div>
            <div 
              className="forecast-value"
              style={{ color: getForecastColor(data.forecast) }}
            >
              {data.forecast}
            </div>
          </div>

          {data.amenities && data.amenities.length > 0 && (
            <div className="amenities-section">
              <div className="amenities-label">Amenities</div>
              <div className="amenities-list">
                {data.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    <span className="amenity-bullet">•</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="popup-footer">
            <button className="visit-site-button">
              Visit Site
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Civ6Popup