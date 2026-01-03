import React, { useState, useEffect } from 'react'
import { EventProvider, useEventContext } from './context/EventContext'
import Login from './components/Login'

function App() {
  const [activeTab, setActiveTab] = useState('settings')
  const [currentUser, setCurrentUser] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPhone, setUserPhone] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('kiro-current-user')
    const savedEmail = localStorage.getItem('kiro-current-email')
    const savedPhone = localStorage.getItem('kiro-current-phone')
    if (savedUser && savedEmail) {
      setCurrentUser(savedUser)
      setUserEmail(savedEmail)
      setUserPhone(savedPhone || '')
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (username, email, phone) => {
    setCurrentUser(username)
    setUserEmail(email)
    setUserPhone(phone || '')
    setIsLoggedIn(true)
    localStorage.setItem('kiro-current-user', username)
    localStorage.setItem('kiro-current-email', email)
    localStorage.setItem('kiro-current-phone', phone || '')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setUserEmail('')
    setUserPhone('')
    setIsLoggedIn(false)
    localStorage.removeItem('kiro-current-user')
    localStorage.removeItem('kiro-current-email')
    localStorage.removeItem('kiro-current-phone')
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <EventProvider currentUser={currentUser}>
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser} 
          userEmail={userEmail}
          userPhone={userPhone}
          onLogout={handleLogout}
        />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <Content activeTab={activeTab} userEmail={userEmail} userPhone={userPhone} />
        </div>
      </div>
    </EventProvider>
  )
}

const Navigation = ({ activeTab, setActiveTab, currentUser, userEmail, userPhone, onLogout }) => {
  const tabs = [
    { id: 'settings', label: 'User Settings' },
    { id: 'events', label: 'Live Events' },
    { id: 'wishlist', label: 'Wish List' },
    { id: 'saveddata', label: 'Saved Data' },
    { id: 'developer', label: 'Developer' }
  ]

  return (
    <nav style={{ background: 'white', padding: '16px 0', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#f8f9fa' : 'transparent',
                color: activeTab === tab.id ? '#007bff' : '#666',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              👤 {currentUser}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              📧 {userEmail}
            </div>
            {userPhone && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                📱 {userPhone}
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

const Content = ({ activeTab, userEmail, userPhone }) => {
  switch (activeTab) {
    case 'settings':
      return <UserSettings userEmail={userEmail} userPhone={userPhone} />
    case 'events':
      return <LiveEvents />
    case 'wishlist':
      return <WishList />
    case 'saveddata':
      return <SavedData />
    case 'developer':
      return <Developer />
    default:
      return <UserSettings userEmail={userEmail} userPhone={userPhone} />
  }
}

const UserSettings = ({ userEmail, userPhone }) => {
  const { settings, updateSettings } = useEventContext()
  const [formData, setFormData] = useState({
    ...settings,
    emailAddress: userEmail || settings.emailAddress || '',
    phoneNumber: userPhone || settings.phoneNumber || '',
    notificationMethod: settings.notificationMethod || 'both',
    freeTextSearch: settings.freeTextSearch || ''
  })
  const [newUrl, setNewUrl] = useState('')
  const [distanceUnit, setDistanceUnit] = useState(settings.distanceUnit || 'km')

  React.useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, emailAddress: userEmail }))
    }
    if (userPhone) {
      setFormData(prev => ({ ...prev, phoneNumber: userPhone }))
    }
  }, [userEmail, userPhone])

  const DEFAULT_TAGS = [
    'technology', 'music', 'food', 'sports', 'art', 'business', 
    'health', 'education', 'travel', 'fashion', 'gaming', 'science',
    'ai', 'policy', 'regulation', 'israel'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      interestTags: prev.interestTags.includes(tag)
        ? prev.interestTags.filter(t => t !== tag)
        : [...prev.interestTags, tag]
    }))
  }

  const handleAddUrl = () => {
    if (newUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        monitorUrls: [...prev.monitorUrls, { id: Date.now(), url: newUrl.trim() }]
      }))
      setNewUrl('')
    }
  }

  const handleRemoveUrl = (id) => {
    setFormData(prev => ({
      ...prev,
      monitorUrls: prev.monitorUrls.filter(item => item.id !== id)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const settingsWithUnit = {
      ...formData,
      distanceUnit: distanceUnit
    }
    updateSettings(settingsWithUnit)
    alert('Settings saved!')
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>User Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>📧 Email</label>
          <input 
            type="email" 
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder="your-email@example.com" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>📱 Phone</label>
          <input 
            type="tel" 
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1234567890" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🎭 Artist/Speaker Search</label>
          <input 
            type="text" 
            name="freeTextSearch"
            value={formData.freeTextSearch}
            onChange={handleInputChange}
            placeholder="Taylor Swift, Elon Musk, Google..." 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🔔 Notifications</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="radio"
                name="notificationMethod"
                value="email"
                checked={formData.notificationMethod === 'email'}
                onChange={handleInputChange}
              />
              📧 Email
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="radio"
                name="notificationMethod"
                value="sms"
                checked={formData.notificationMethod === 'sms'}
                onChange={handleInputChange}
              />
              📱 SMS
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="radio"
                name="notificationMethod"
                value="both"
                checked={formData.notificationMethod === 'both'}
                onChange={handleInputChange}
              />
              📧📱 Both
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🏠 Address</label>
          <input 
            type="text" 
            name="homeAddress"
            value={formData.homeAddress}
            onChange={handleInputChange}
            placeholder="123 Main St, New York, NY" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>📏 Distance</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number" 
              name="searchRadius"
              value={formData.searchRadius}
              onChange={handleInputChange}
              min="1" 
              max="100" 
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            <select 
              value={distanceUnit} 
              onChange={(e) => setDistanceUnit(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="km">KM</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🏷️ Categories</label>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
            {DEFAULT_TAGS.map(tag => (
              <span
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  display: 'inline-block',
                  background: formData.interestTags.includes(tag) ? '#007bff' : '#e9ecef',
                  color: formData.interestTags.includes(tag) ? 'white' : '#495057',
                  padding: '4px 8px',
                  margin: '2px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🌐 Monitor URLs</label>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px' }}>
            {formData.monitorUrls.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '14px' }}>{item.url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(item.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://eventbrite.com"
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          💾 Save
        </button>
      </form>
    </div>
  )
}

const LiveEvents = () => {
  const { events, settings, hideEvent } = useEventContext()
  const [dateFilter, setDateFilter] = useState('all')

  const formatDistance = (distanceKm) => {
    if (settings.distanceUnit === 'miles') {
      return `${(distanceKm * 0.621371).toFixed(1)} miles`
    }
    return `${distanceKm} KM`
  }

  const getFilteredEvents = () => {
    const now = new Date()
    let cutoff = new Date()
    
    switch (dateFilter) {
      case 'week': cutoff.setDate(now.getDate() + 7); break
      case 'month': cutoff.setMonth(now.getMonth() + 1); break
      case '3months': cutoff.setMonth(now.getMonth() + 3); break
      case '6months': cutoff.setMonth(now.getMonth() + 6); break
      case 'year': cutoff.setFullYear(now.getFullYear() + 1); break
      default: return events
    }
    
    return events.filter(event => {
      const eventDate = new Date(event.eventDate)
      return eventDate >= now && eventDate <= cutoff
    })
  }

  const filteredEvents = getFilteredEvents()

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Live Events ({filteredEvents.length})</h2>
        
        <select 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="all">All upcoming</option>
          <option value="week">Next 7 days</option>
          <option value="month">Next month</option>
          <option value="3months">Next 3 months</option>
          <option value="6months">Next 6 months</option>
          <option value="year">Next year</option>
        </select>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredEvents.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h3>{event.name}</h3>
                <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                <p>📍 {formatDistance(event.distance)} • 💰 {event.price}</p>
                <p>🌐 {event.sourceSite}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => window.open(event.registerUrl, '_blank')}
                  style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
                >
                  Register
                </button>
                <button 
                  onClick={() => hideEvent(event.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px' }}
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const WishList = () => {
  const { wishListKeywords, setWishListKeywords, getFilteredEvents } = useEventContext()
  const [newKeyword, setNewKeyword] = useState('')

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>Wish List</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          placeholder="Add keyword"
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button
          onClick={() => {
            if (newKeyword.trim()) {
              setWishListKeywords([...wishListKeywords, newKeyword.trim()])
              setNewKeyword('')
            }
          }}
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
        >
          Add
        </button>
      </div>
      
      <div>
        {wishListKeywords.map(keyword => (
          <span key={keyword} style={{ background: '#007bff', color: 'white', padding: '4px 8px', margin: '2px', borderRadius: '4px', fontSize: '12px' }}>
            {keyword}
          </span>
        ))}
      </div>
    </div>
  )
}

const SavedData = () => {
  const { settings } = useEventContext()
  
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>Saved Data</h2>
      <pre style={{ background: '#f8f9fa', padding: '16px', borderRadius: '4px', fontSize: '12px' }}>
        {JSON.stringify(settings, null, 2)}
      </pre>
    </div>
  )
}

const Developer = () => {
  const [data, setData] = useState(null)

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>Developer</h2>
      <div style={{ marginBottom: '16px' }}>
        <div><strong>API Key:</strong> f90220f746cb49a0bfbf914e4c78bd91</div>
        <div><strong>Webhook:</strong> SagiEventMonitor2026</div>
      </div>
      
      <button 
        onClick={() => {
          const user = localStorage.getItem('kiro-current-user')
          const saved = localStorage.getItem(`kiro-${user}-preferences`)
          setData(saved ? JSON.parse(saved) : null)
        }}
        style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', marginRight: '8px' }}
      >
        Show Data
      </button>
      
      {data && (
        <button 
          onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
          style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
        >
          Copy
        </button>
      )}
      
      {data && (
        <pre style={{ background: '#000', color: '#0f0', padding: '16px', borderRadius: '4px', marginTop: '16px', fontSize: '12px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App
