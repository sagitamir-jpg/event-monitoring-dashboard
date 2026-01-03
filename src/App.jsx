import React, { useState, useEffect } from 'react'
import { EventProvider, useEventContext } from './context/EventContext'
import Login from './components/Login'

function App() {
  const [activeTab, setActiveTab] = useState('settings')
  const [currentUser, setCurrentUser] = useState(null)
  const [userEmail, setUserEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userPhone, setUserPhone] = useState('')

  // Check if user is already logged in
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
    { id: 'userguide', label: 'User Guide' },
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
    case 'userguide':
      return <UserGuide />
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
    smsForAllEvents: settings.smsForAllEvents !== false,
    smsForWishListOnly: settings.smsForWishListOnly !== false,
    urgentSmsNotifications: settings.urgentSmsNotifications !== false,
    emailDailyDigest: settings.emailDailyDigest !== false,
    emailInstantAlerts: settings.emailInstantAlerts !== false,
    emailWeeklyReport: settings.emailWeeklyReport !== false
  })
  const [newUrl, setNewUrl] = useState('')
  const [customCategories, setCustomCategories] = useState(settings.customCategories || [])
  const [newCategory, setNewCategory] = useState('')
  const [distanceUnit, setDistanceUnit] = useState(settings.distanceUnit || 'km')

  // Update email and phone when props change
  React.useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, emailAddress: userEmail }))
    }
    if (userPhone) {
      setFormData(prev => ({ ...prev, phoneNumber: userPhone }))
    }
  }, [userEmail, userPhone])

  // Update distance unit when settings change
  React.useEffect(() => {
    if (settings.distanceUnit) {
      setDistanceUnit(settings.distanceUnit)
    }
    if (settings.customCategories) {
      setCustomCategories(settings.customCategories)
    }
  }, [settings])

  const DEFAULT_TAGS = [
    'technology', 'music', 'food', 'sports', 'art', 'business', 
    'health', 'education', 'travel', 'fashion', 'gaming', 'science',
    'ai', 'policy', 'regulation', 'israel'
  ]

  const ALL_TAGS = [...DEFAULT_TAGS, ...customCategories]

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

  const handleAddCategory = () => {
    if (newCategory.trim() && !ALL_TAGS.includes(newCategory.trim().toLowerCase())) {
      const category = newCategory.trim().toLowerCase()
      setCustomCategories(prev => [...prev, category])
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (category) => {
    setCustomCategories(prev => prev.filter(c => c !== category))
    // Also remove from selected tags if it was selected
    setFormData(prev => ({
      ...prev,
      interestTags: prev.interestTags.filter(t => t !== category)
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
    // Include custom categories and distance unit in the saved settings
    const settingsWithCategories = {
      ...formData,
      customCategories: customCategories,
      distanceUnit: distanceUnit
    }
    updateSettings(settingsWithCategories)
    alert('Settings saved successfully! Your custom categories are now permanent.')
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>User Settings</h2>
      <p>Configure your event monitoring preferences</p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>📧 Email Address</label>
          <input 
            type="email" 
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder="Enter your email for event notifications" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            📧 You'll receive email notifications when new events matching your preferences are found
          </small>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>📱 Phone Number</label>
          <input 
            type="tel" 
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number (e.g., +1234567890)" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            📱 You'll receive SMS text messages for high-priority events
          </small>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>🎭 Artist/Speaker/Company Search</label>
          <input 
            type="text" 
            name="freeTextSearch"
            value={formData.freeTextSearch || ''}
            onChange={handleInputChange}
            placeholder="Search for specific artists, speakers, companies (e.g., Taylor Swift, Elon Musk, Google)" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            💡 Enter names of artists, speakers, or companies you want to find events for
          </small>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>🔔 Notification Method</label>
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '16px', background: '#f8f9fa' }}>
            
            {/* Primary Notification Method */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#007bff' }}>
                📢 How do you want to receive notifications?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '4px', background: formData.notificationMethod === 'email' ? '#e7f3ff' : 'white', border: formData.notificationMethod === 'email' ? '2px solid #007bff' : '1px solid #ddd' }}>
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={formData.notificationMethod === 'email'}
                    onChange={(e) => setFormData(prev => ({ ...prev, notificationMethod: e.target.value }))}
                  />
                  <span style={{ fontWeight: '500' }}>📧 Email Only</span>
                  <small style={{ color: '#666' }}>- Detailed event information, links, and descriptions</small>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '4px', background: formData.notificationMethod === 'sms' ? '#e7f3ff' : 'white', border: formData.notificationMethod === 'sms' ? '2px solid #007bff' : '1px solid #ddd' }}>
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="sms"
                    checked={formData.notificationMethod === 'sms'}
                    onChange={(e) => setFormData(prev => ({ ...prev, notificationMethod: e.target.value }))}
                  />
                  <span style={{ fontWeight: '500' }}>📱 SMS Only</span>
                  <small style={{ color: '#666' }}>- Quick alerts with event name, date, and registration link</small>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '4px', background: formData.notificationMethod === 'both' ? '#e7f3ff' : 'white', border: formData.notificationMethod === 'both' ? '2px solid #007bff' : '1px solid #ddd' }}>
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="both"
                    checked={formData.notificationMethod === 'both'}
                    onChange={(e) => setFormData(prev => ({ ...prev, notificationMethod: e.target.value }))}
                  />
                  <span style={{ fontWeight: '500' }}>📧📱 Both Email & SMS</span>
                  <small style={{ color: '#666' }}>- Email for details + SMS for instant alerts</small>
                </label>
              </div>
            </div>

            {/* Advanced SMS Settings (only show if SMS is selected) */}
            {(formData.notificationMethod === 'sms' || formData.notificationMethod === 'both') && (
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#28a745' }}>
                  📱 SMS Preferences
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="smsForAllEvents"
                      checked={formData.smsForAllEvents}
                      onChange={(e) => setFormData(prev => ({ ...prev, smsForAllEvents: e.target.checked }))}
                    />
                    <span>📱 SMS for all matching events</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="smsForWishListOnly"
                      checked={formData.smsForWishListOnly}
                      onChange={(e) => setFormData(prev => ({ ...prev, smsForWishListOnly: e.target.checked }))}
                    />
                    <span>⭐ SMS for wish list events only</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="urgentSmsNotifications"
                      checked={formData.urgentSmsNotifications}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgentSmsNotifications: e.target.checked }))}
                    />
                    <span>🚨 Urgent SMS for free events ending soon</span>
                  </label>
                </div>
              </div>
            )}

            {/* Email Settings (only show if Email is selected) */}
            {(formData.notificationMethod === 'email' || formData.notificationMethod === 'both') && (
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#dc3545' }}>
                  📧 Email Preferences
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="emailDailyDigest"
                      checked={formData.emailDailyDigest}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailDailyDigest: e.target.checked }))}
                    />
                    <span>📅 Daily digest of new events</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="emailInstantAlerts"
                      checked={formData.emailInstantAlerts}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailInstantAlerts: e.target.checked }))}
                    />
                    <span>⚡ Instant email alerts for new events</span>
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="emailWeeklyReport"
                      checked={formData.emailWeeklyReport}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailWeeklyReport: e.target.checked }))}
                    />
                    <span>📊 Weekly report of upcoming events</span>
                  </label>
                </div>
              </div>
            )}

            {/* Notification Summary */}
            <div style={{ marginTop: '16px', padding: '12px', background: '#e7f3ff', borderRadius: '4px', border: '1px solid #b3d9ff' }}>
              <strong style={{ color: '#007bff' }}>📋 Your Notification Setup:</strong>
              <div style={{ marginTop: '4px', fontSize: '14px', color: '#333' }}>
                {formData.notificationMethod === 'email' && '📧 You will receive detailed email notifications only'}
                {formData.notificationMethod === 'sms' && '📱 You will receive quick SMS text messages only'}
                {formData.notificationMethod === 'both' && '📧📱 You will receive both email and SMS notifications'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Home Address</label>
          <input 
            type="text" 
            name="homeAddress"
            value={formData.homeAddress}
            onChange={handleInputChange}
            placeholder="Enter your home address (e.g., 123 Main St, New York, NY)" 
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
          />
          <small style={{ color: '#666', fontSize: '12px' }}>💡 This is used to calculate distances to events</small>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Search Distance</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="number" 
              name="searchRadius"
              value={formData.searchRadius}
              onChange={handleInputChange}
              min="1" 
              max={distanceUnit === 'km' ? "100" : "62"} 
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }} 
            />
            <select 
              value={distanceUnit} 
              onChange={(e) => setDistanceUnit(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
            >
              <option value="km">Kilometers (KM)</option>
              <option value="miles">Miles</option>
            </select>
          </div>
          <small style={{ color: '#666', fontSize: '12px' }}>
            💡 How far you're willing to travel ({distanceUnit === 'km' ? '1-100 km' : '1-62 miles'})
          </small>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Interest Categories</label>
          <small style={{ color: '#666', fontSize: '12px', marginBottom: '8px', display: 'block' }}>💡 Click categories you're interested in (they turn blue when selected)</small>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px', minHeight: '120px', marginBottom: '8px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ fontSize: '12px', color: '#007bff' }}>Default Categories:</strong>
            </div>
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
            
            {customCategories.length > 0 && (
              <>
                <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '12px', color: '#28a745' }}>Your Custom Categories:</strong>
                </div>
                {customCategories.map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-block',
                      background: formData.interestTags.includes(tag) ? '#007bff' : '#e9ecef',
                      color: formData.interestTags.includes(tag) ? 'white' : '#495057',
                      padding: '4px 8px',
                      margin: '2px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <span onClick={() => handleTagToggle(tag)}>{tag}</span>
                    <span 
                      onClick={() => handleRemoveCategory(tag)}
                      style={{ 
                        marginLeft: '4px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold',
                        color: '#dc3545'
                      }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
              placeholder="Add custom category (e.g., workshops, networking)"
              style={{ flex: 1, padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              + Add Category
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Monitor URLs</label>
          <small style={{ color: '#666', fontSize: '12px', marginBottom: '8px', display: 'block' }}>💡 Websites to watch for new events (e.g., eventbrite.com, meetup.com)</small>
          
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '8px', minHeight: '120px' }}>
            {formData.monitorUrls.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '14px' }}>{item.url}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(item.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://eventbrite.com)"
                style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <button
                type="button"
                onClick={handleAddUrl}
                style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Add URL
              </button>
            </div>
          </div>
        </div>

        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          💾 Save Settings
        </button>
      </form>
    </div>
  )
}

const LiveEvents = () => {
  const { events, settings, hideEvent } = useEventContext()
  const [dateFilter, setDateFilter] = useState('all') // all, week, month, 3months, 6months, year

  const handleRegister = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleHideEvent = (eventId, eventName) => {
    if (window.confirm(`Hide "${eventName}" from your event list? You can unhide it later in settings.`)) {
      hideEvent(eventId)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDistance = (distanceKm) => {
    if (settings.distanceUnit === 'miles') {
      const miles = (distanceKm * 0.621371).toFixed(1)
      return `${miles} miles`
    }
    return `${distanceKm} KM`
  }

  const getFilteredEventsByDate = () => {
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (dateFilter) {
      case 'week':
        cutoffDate.setDate(now.getDate() + 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() + 1)
        break
      case '3months':
        cutoffDate.setMonth(now.getMonth() + 3)
        break
      case '6months':
        cutoffDate.setMonth(now.getMonth() + 6)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() + 1)
        break
      default:
        return events // Show all events
    }
    
    return events.filter(event => {
      const eventDate = new Date(event.eventDate)
      return eventDate >= now && eventDate <= cutoffDate
    })
  }

  const filteredEvents = getFilteredEventsByDate()

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2>Live Events</h2>
          <p>Future events found within your search radius ({filteredEvents.length} of {events.length} events)</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: '500', color: '#333' }}>📅 Show events:</label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              background: 'white',
              fontSize: '14px'
            }}
          >
            <option value="all">All upcoming events</option>
            <option value="week">Next 7 days</option>
            <option value="month">Next month</option>
            <option value="3months">Next 3 months</option>
            <option value="6months">Next 6 months</option>
            <option value="year">Next year</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredEvents.map(event => (
          <div key={event.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '20px',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    display: 'inline-block',
                    background: event.status === 'available' ? '#28a745' : '#dc3545'
                  }} />
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{event.name}</h3>
                  <span style={{ 
                    background: event.price === 'Free' ? '#28a745' : '#007bff', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {event.price}
                  </span>
                </div>
                
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  📅 {formatDate(event.eventDate)}
                </div>
                
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  📍 {event.location} • {formatDistance(event.distance)} away
                </div>
                
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  🌐 Published on: <strong>{event.sourceSite}</strong>
                </div>
                
                <p style={{ color: '#555', fontSize: '14px', margin: '8px 0' }}>
                  {event.description}
                </p>
                
                <div style={{ marginBottom: '12px' }}>
                  {event.tags.map(tag => (
                    <span key={tag} style={{ 
                      background: '#e9ecef', 
                      color: '#495057', 
                      padding: '3px 8px', 
                      margin: '2px 4px 2px 0', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      display: 'inline-block'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleRegister(event.registerUrl)}
                  style={{ 
                    background: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 20px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  🎫 Register
                </button>
                
                <button 
                  onClick={() => handleHideEvent(event.id, event.name)}
                  style={{ 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 16px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                  title="Hide this event"
                >
                  🗑️ Hide
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <h3>No events found for selected time period</h3>
            <p>Try selecting a longer time range or check back later for new events.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const WishList = () => {
  const { wishListKeywords, setWishListKeywords, getFilteredEvents, settings } = useEventContext()
  const [newKeyword, setNewKeyword] = useState('')
  const filteredEvents = getFilteredEvents()

  const addKeyword = () => {
    if (newKeyword.trim() && !wishListKeywords.includes(newKeyword.trim().toLowerCase())) {
      setWishListKeywords([...wishListKeywords, newKeyword.trim().toLowerCase()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword) => {
    setWishListKeywords(wishListKeywords.filter(k => k !== keyword))
  }

  const formatDistance = (distanceKm) => {
    if (settings.distanceUnit === 'miles') {
      const miles = (distanceKm * 0.621371).toFixed(1)
      return `${miles} miles`
    }
    return `${distanceKm} KM`
  }

  return (
    <div>
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
        <h2>Wish List Keywords</h2>
        <p>Define keywords to filter high-priority events</p>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {wishListKeywords.map(keyword => (
              <span key={keyword} style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {keyword}
                <span 
                  onClick={() => removeKeyword(keyword)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add new keyword"
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <button
              onClick={addKeyword}
              style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
        <h2>Filtered Events ({filteredEvents.length} found)</h2>
        
        {filteredEvents.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {filteredEvents.map(event => (
              <div key={event.id} style={{ 
                border: '2px solid #007bff', 
                borderRadius: '8px', 
                padding: '16px',
                background: '#f8f9ff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: '4px' }}>{event.name}</h4>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      📅 {new Date(event.eventDate).toLocaleDateString()} • 💰 {event.price} • 📍 {formatDistance(event.distance)} • 🌐 {event.sourceSite}
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(event.registerUrl, '_blank')}
                    style={{ 
                      background: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      padding: '8px 12px', 
                      borderRadius: '4px', 
                      cursor: 'pointer'
                    }}
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No events match your keywords. Try adding more keywords.
          </p>
        )}
      </div>
    </div>
  )
}

const SavedData = () => {
  const { settings, wishListKeywords } = useEventContext()

  const getNotificationMethodDisplay = () => {
    switch (settings.notificationMethod) {
      case 'email': return '📧 Email Only'
      case 'sms': return '📱 SMS Only'
      case 'both': return '📧📱 Both Email & SMS'
      default: return 'Not set'
    }
  }

  const getActiveNotificationSettings = () => {
    const active = []
    if (settings.notificationMethod === 'sms' || settings.notificationMethod === 'both') {
      if (settings.smsForAllEvents) active.push('SMS for all events')
      if (settings.smsForWishListOnly) active.push('SMS for wish list')
      if (settings.urgentSmsNotifications) active.push('Urgent SMS alerts')
    }
    if (settings.notificationMethod === 'email' || settings.notificationMethod === 'both') {
      if (settings.emailDailyDigest) active.push('Daily email digest')
      if (settings.emailInstantAlerts) active.push('Instant email alerts')
      if (settings.emailWeeklyReport) active.push('Weekly email report')
    }
    return active
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>Saved Data Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '16px' }}>
        <div>
          <h4>📍 Location Settings</h4>
          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
            <div><strong>Address:</strong> {settings.homeAddress || 'Not set'}</div>
            <div><strong>Radius:</strong> {settings.searchRadius} {settings.distanceUnit === 'miles' ? 'Miles' : 'KM'}</div>
            <div><strong>Distance Unit:</strong> {settings.distanceUnit === 'miles' ? 'Miles' : 'Kilometers'}</div>
            <div><strong>Tags:</strong> {settings.interestTags.join(', ') || 'None'}</div>
            <div><strong>Monitor URLs:</strong></div>
            <div style={{ marginLeft: '10px', fontSize: '12px' }}>
              {settings.monitorUrls && settings.monitorUrls.length > 0 ? (
                settings.monitorUrls.map((urlObj, index) => (
                  <div key={index} style={{ color: '#007bff' }}>
                    • {urlObj.url || urlObj}
                  </div>
                ))
              ) : (
                <div style={{ color: '#666' }}>No URLs configured</div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h4>⭐ Wish List</h4>
          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
            <div><strong>Keywords:</strong> {wishListKeywords.join(', ') || 'None'}</div>
            <div><strong>Total:</strong> {wishListKeywords.length}</div>
          </div>
        </div>

        <div>
          <h4>🔔 Notifications</h4>
          <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
            <div><strong>Method:</strong> {getNotificationMethodDisplay()}</div>
            <div><strong>Email:</strong> {settings.emailAddress || 'Not set'}</div>
            <div><strong>Phone:</strong> {settings.phoneNumber || 'Not set'}</div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              <strong>Active Settings:</strong>
              <div style={{ marginTop: '4px' }}>
                {getActiveNotificationSettings().length > 0 ? (
                  getActiveNotificationSettings().map((setting, index) => (
                    <div key={index} style={{ color: '#28a745' }}>✓ {setting}</div>
                  ))
                ) : (
                  <div style={{ color: '#666' }}>No preferences set</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UserGuide = () => {
  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>📖 User Guide - How to Use the Event Monitoring Dashboard</h2>
      
      <div style={{ display: 'grid', gap: '24px', marginTop: '20px' }}>
        
        {/* Getting Started */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#007bff', marginTop: 0 }}>🚀 Getting Started</h3>
          <ol style={{ lineHeight: '1.6' }}>
            <li><strong>Create Account:</strong> Register with username, email, and phone number</li>
            <li><strong>Configure Settings:</strong> Go to "User Settings" tab and fill in your preferences</li>
            <li><strong>Set Location:</strong> Enter your home address and search radius</li>
            <li><strong>Choose Categories:</strong> Select event types you're interested in</li>
            <li><strong>Add Websites:</strong> Add event websites you want to monitor</li>
            <li><strong>Save Settings:</strong> Click "Save Settings" to store your preferences</li>
          </ol>
        </div>

        {/* Features Overview */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#28a745', marginTop: 0 }}>✨ Dashboard Features</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4>📅 Live Events</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <li>View all upcoming events in your area</li>
                <li>Filter by date (7 days, month, 3 months, etc.)</li>
                <li>See event details, prices, and locations</li>
                <li>Click "Register" to go to event website</li>
                <li>Hide events you're not interested in</li>
              </ul>
            </div>
            
            <div>
              <h4>⭐ Wish List</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <li>Add keywords for specific events you want</li>
                <li>Find events matching your keywords</li>
                <li>Get priority notifications for wish list events</li>
                <li>Search for artists, speakers, companies</li>
              </ul>
            </div>
            
            <div>
              <h4>💾 Saved Data</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <li>View all your current settings</li>
                <li>See notification preferences</li>
                <li>Check monitor URLs</li>
                <li>Review wish list keywords</li>
              </ul>
            </div>
            
            <div>
              <h4>🔧 Developer</h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
                <li>Copy your settings as JSON</li>
                <li>Paste into Base44 for notifications</li>
                <li>View API keys and webhook secrets</li>
                <li>Debug your configuration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications Setup */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#dc3545', marginTop: 0 }}>🔔 Setting Up Notifications</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <h4>Step 1: Configure Dashboard</h4>
            <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Fill in your email and phone number in User Settings</li>
              <li>Choose notification method (Email, SMS, or Both)</li>
              <li>Set your preferences for each notification type</li>
              <li>Save your settings</li>
            </ol>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h4>Step 2: Connect to Base44</h4>
            <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Go to Developer tab and click "Show Saved Data"</li>
              <li>Click "Copy Data" to copy your JSON settings</li>
              <li>Go to <a href="https://base44.com" target="_blank" rel="noopener noreferrer">Base44.com</a></li>
              <li>Create account or login</li>
              <li>Paste your JSON data into Base44 interface</li>
              <li>Base44 will start monitoring and sending notifications</li>
            </ol>
          </div>
          
          <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
            <strong>⚠️ Important:</strong> Base44 handles the actual event monitoring and notifications. 
            This dashboard is for configuring your preferences and viewing events.
          </div>
        </div>

        {/* Multi-User Setup */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#6f42c1', marginTop: 0 }}>👥 Multi-User Setup</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <h4>For Family Members:</h4>
            <ol style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li>Each person creates their own account on the dashboard</li>
              <li>Each person configures their own settings and preferences</li>
              <li>Each person gets their own JSON data from Developer tab</li>
              <li>Create separate Base44 accounts for each person</li>
              <li>Paste each person's JSON into their own Base44 account</li>
            </ol>
          </div>
          
          <div style={{ background: '#d1ecf1', padding: '12px', borderRadius: '4px', border: '1px solid #bee5eb' }}>
            <strong>💡 Tip:</strong> Each user's data is completely private and separate. 
            No mixing between accounts!
          </div>
        </div>

        {/* Troubleshooting */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#fd7e14', marginTop: 0 }}>🔧 Troubleshooting</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <h4>Common Issues:</h4>
            <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <li><strong>Not receiving SMS:</strong> Check Base44 SMS configuration, verify phone format (+1234567890)</li>
              <li><strong>No events showing:</strong> Check your location settings and search radius</li>
              <li><strong>Login not remembered:</strong> Make sure cookies are enabled in your browser</li>
              <li><strong>Base44 not working:</strong> Copy fresh JSON from Developer tab and re-paste</li>
              <li><strong>Duplicate events:</strong> Use the "Hide" button to remove unwanted events</li>
            </ul>
          </div>
          
          <div style={{ background: '#f8d7da', padding: '12px', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
            <strong>🆘 Need Help?</strong> Check the troubleshooting guides in your project files or contact support.
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div style={{ border: '1px solid #e9ecef', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#20c997', marginTop: 0 }}>💡 Tips & Best Practices</h3>
          
          <ul style={{ fontSize: '14px', lineHeight: '1.5' }}>
            <li><strong>Start Small:</strong> Begin with a few categories and expand as needed</li>
            <li><strong>Use Wish List:</strong> Add specific keywords for events you really want to find</li>
            <li><strong>Check Regularly:</strong> Visit the dashboard weekly to see new events</li>
            <li><strong>Update Settings:</strong> Adjust your preferences as your interests change</li>
            <li><strong>Hide Unwanted Events:</strong> Use the hide feature to clean up your event list</li>
            <li><strong>Monitor Multiple Sites:</strong> Add various event websites for better coverage</li>
            <li><strong>Use Date Filters:</strong> Filter events by time period to focus on relevant dates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const Developer = () => {
  const [savedData, setSavedData] = useState(null)
  const { settings } = useEventContext()

  const checkData = () => {
    try {
      // Get current user from localStorage
      const currentUser = localStorage.getItem('kiro-current-user') || 'User1'
      const data = localStorage.getItem(`kiro-${currentUser}-preferences`)
      if (data) {
        setSavedData(JSON.parse(data))
      } else {
        alert('No data found. Save some settings first!')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const copyData = () => {
    if (savedData) {
      navigator.clipboard.writeText(JSON.stringify(savedData, null, 2))
      alert('Data copied to clipboard!')
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px' }}>
      <h2>Developer Tools</h2>
      
      <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '4px', marginBottom: '16px' }}>
        <div><strong>API Key:</strong> f90220f746cb49a0bfbf914e4c78bd91</div>
        <div><strong>Webhook Secret:</strong> SagiEventMonitor2026</div>
        <div><strong>Current User:</strong> {localStorage.getItem('kiro-current-user') || 'Not logged in'}</div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={checkData} style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Show Saved Data
        </button>
        {savedData && (
          <button onClick={copyData} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            Copy Data
          </button>
        )}
      </div>

      {savedData && (
        <div style={{ background: '#000', color: '#0f0', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
          <pre>{JSON.stringify(savedData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
