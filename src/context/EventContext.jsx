import React, { createContext, useContext, useState } from 'react'

const EventContext = createContext()

export const useEventContext = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider')
  }
  return context
}

export const EventProvider = ({ children, currentUser = 'User1' }) => {
  const getUserKey = (key) => `kiro-${currentUser}-${key}`
  
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(getUserKey('preferences'))
      if (saved) {
        const data = JSON.parse(saved)
        return {
          homeAddress: data.homeAddress || '',
          searchRadius: data.searchRadius || 10,
          interestTags: data.interestTags || [],
          monitorUrls: data.monitorUrls || [],
          emailAddress: data.emailAddress || '',
          phoneNumber: data.phoneNumber || '',
          notificationMethod: data.notificationMethod || 'both',
          smsForAllEvents: data.smsForAllEvents !== undefined ? data.smsForAllEvents : false,
          smsForWishListOnly: data.smsForWishListOnly !== undefined ? data.smsForWishListOnly : true,
          urgentSmsNotifications: data.urgentSmsNotifications !== undefined ? data.urgentSmsNotifications : true,
          emailDailyDigest: data.emailDailyDigest !== undefined ? data.emailDailyDigest : false,
          emailInstantAlerts: data.emailInstantAlerts !== undefined ? data.emailInstantAlerts : true,
          emailWeeklyReport: data.emailWeeklyReport !== undefined ? data.emailWeeklyReport : false,
          distanceUnit: data.distanceUnit || 'km',
          customCategories: data.customCategories || [],
          freeTextSearch: data.freeTextSearch || ''
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
    return {
      homeAddress: '',
      searchRadius: 10,
      interestTags: [],
      monitorUrls: [],
      emailAddress: '',
      phoneNumber: '',
      notificationMethod: 'both',
      smsForAllEvents: false,
      smsForWishListOnly: true,
      urgentSmsNotifications: true,
      emailDailyDigest: false,
      emailInstantAlerts: true,
      emailWeeklyReport: false,
      distanceUnit: 'km',
      customCategories: [],
      freeTextSearch: ''
    }
  }

  const loadWishListKeywords = () => {
    try {
      const saved = localStorage.getItem(getUserKey('preferences'))
      if (saved) {
        const data = JSON.parse(saved)
        return data.wishListKeywords || ['technology', 'conference']
      }
    } catch (error) {
      console.error('Error loading wish list:', error)
    }
    return ['technology', 'conference']
  }

  const [settings, setSettings] = useState(loadSavedData())
  const [saveHistory, setSaveHistory] = useState([])
  const [wishListKeywords, setWishListKeywordsState] = useState(loadWishListKeywords())

  const [events] = useState([
    {
      id: 1,
      name: 'Tech Conference 2024',
      sourceSite: 'Eventbrite',
      distance: 5.2,
      status: 'available',
      registerUrl: 'https://www.eventbrite.com',
      tags: ['technology', 'conference'],
      eventDate: '2026-02-15T10:00:00Z',
      price: '$299',
      description: 'Annual technology conference featuring AI, blockchain, and web development',
      location: 'Convention Center, Downtown',
      isHidden: false
    },
    {
      id: 2,
      name: 'Summer Music Festival',
      sourceSite: 'Ticketmaster',
      distance: 12.8,
      status: 'available',
      registerUrl: 'https://www.ticketmaster.com',
      tags: ['music', 'festival'],
      eventDate: '2026-07-20T18:00:00Z',
      price: '$89 - $199',
      description: 'Three-day outdoor music festival with top artists',
      location: 'City Park Amphitheater',
      isHidden: false
    },
    {
      id: 3,
      name: 'Food & Wine Expo',
      sourceSite: 'Meetup',
      distance: 3.1,
      status: 'available',
      registerUrl: 'https://www.meetup.com',
      tags: ['food', 'wine', 'expo'],
      eventDate: '2026-03-25T14:00:00Z',
      price: 'Free',
      description: 'Taste local cuisine and wines from regional vendors',
      location: 'Grand Hotel Ballroom',
      isHidden: false
    },
    {
      id: 4,
      name: 'Business Networking Summit',
      sourceSite: 'Eventbrite',
      distance: 8.5,
      status: 'available',
      registerUrl: 'https://www.eventbrite.com',
      tags: ['business', 'networking'],
      eventDate: '2026-04-10T09:00:00Z',
      price: '$149',
      description: 'Connect with industry leaders and expand your professional network',
      location: 'Business District Conference Hall',
      isHidden: false
    },
    {
      id: 5,
      name: 'AI Policy Summit',
      sourceSite: 'Facebook Events',
      distance: 6.2,
      status: 'available',
      registerUrl: 'https://www.facebook.com/events',
      tags: ['ai', 'policy', 'regulation'],
      eventDate: '2026-02-28T19:00:00Z',
      price: 'Free',
      description: 'Discussion on AI regulation and policy implications for Israel and the region',
      location: 'Government Complex, Jerusalem',
      isHidden: false
    },
    {
      id: 6,
      name: 'Health & Wellness Workshop',
      sourceSite: 'Eventbrite',
      distance: 4.7,
      status: 'available',
      registerUrl: 'https://www.eventbrite.com',
      tags: ['health', 'wellness', 'education'],
      eventDate: '2026-03-15T11:00:00Z',
      price: '$75',
      description: 'Learn about nutrition, fitness, and mental health from experts',
      location: 'Community Health Center',
      isHidden: false
    },
    {
      id: 7,
      name: 'Israel Tech Meetup',
      sourceSite: 'Meetup',
      distance: 2.3,
      status: 'available',
      registerUrl: 'https://www.meetup.com',
      tags: ['israel', 'technology', 'networking'],
      eventDate: '2026-04-05T18:00:00Z',
      price: 'Free',
      description: 'Monthly meetup for Israeli tech professionals and entrepreneurs',
      location: 'Tel Aviv Innovation Center',
      isHidden: false
    }
  ])

  const [hiddenEvents, setHiddenEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(getUserKey('hidden-events'))
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      return []
    }
  })

  const getFutureEvents = () => {
    const now = new Date()
    return events.filter(event => 
      new Date(event.eventDate) > now && 
      !hiddenEvents.includes(event.id)
    )
  }

  const hideEvent = (eventId) => {
    const newHiddenEvents = [...hiddenEvents, eventId]
    setHiddenEvents(newHiddenEvents)
    localStorage.setItem(getUserKey('hidden-events'), JSON.stringify(newHiddenEvents))
  }

  const unhideEvent = (eventId) => {
    const newHiddenEvents = hiddenEvents.filter(id => id !== eventId)
    setHiddenEvents(newHiddenEvents)
    localStorage.setItem(getUserKey('hidden-events'), JSON.stringify(newHiddenEvents))
  }

  const setWishListKeywords = (keywords) => {
    setWishListKeywordsState(keywords)
    
    const currentPrefs = localStorage.getItem(getUserKey('preferences'))
    if (currentPrefs) {
      const prefs = JSON.parse(currentPrefs)
      prefs.wishListKeywords = keywords
      prefs.lastUpdated = new Date().toISOString()
      localStorage.setItem(getUserKey('preferences'), JSON.stringify(prefs))
      console.log('✅ Updated wish list in localStorage:', keywords)
    }
  }

  const updateSettings = async (newSettings) => {
    console.log('🔄 Starting updateSettings...')
    setSettings(newSettings)
    
    const preferences = {
      lastUpdated: new Date().toISOString(),
      homeAddress: newSettings.homeAddress,
      searchRadius: newSettings.searchRadius,
      interestTags: newSettings.interestTags,
      monitorUrls: newSettings.monitorUrls,
      emailAddress: newSettings.emailAddress,
      phoneNumber: newSettings.phoneNumber,
      notificationMethod: newSettings.notificationMethod,
      smsForAllEvents: newSettings.smsForAllEvents,
      smsForWishListOnly: newSettings.smsForWishListOnly,
      urgentSmsNotifications: newSettings.urgentSmsNotifications,
      emailDailyDigest: newSettings.emailDailyDigest,
      emailInstantAlerts: newSettings.emailInstantAlerts,
      emailWeeklyReport: newSettings.emailWeeklyReport,
      distanceUnit: newSettings.distanceUnit,
      customCategories: newSettings.customCategories,
      freeTextSearch: newSettings.freeTextSearch,
      wishListKeywords: wishListKeywords,
      apiKey: 'f90220f746cb49a0bfbf914e4c78bd91',
      webhookSecret: 'SagiEventMonitor2026',
      user: currentUser
    }
    
    localStorage.setItem(getUserKey('preferences'), JSON.stringify(preferences))
    console.log(`✅ Saved to localStorage for ${currentUser}:`, preferences)
    
    // 🔄 AUTO-SYNC TO BASE44
    console.log('🔄 Auto-syncing to Base44...')
    try {
      const response = await fetch('https://app.base44.com/apps/69573a88918e265269827fe9/editor/preview/EventMonitoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer f90220f746cb49a0bfbf914e4c78bd91',
          'X-API-Key': 'f90220f746cb49a0bfbf914e4c78bd91'
        },
        body: JSON.stringify(preferences)
      })

      if (response.ok) {
        console.log('✅ Successfully synced to Base44!')
      } else {
        console.warn('⚠️ Base44 sync failed:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ Base44 sync error:', error)
    }
    
    const saveRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      type: 'Settings Update',
      data: { ...newSettings },
      status: 'Success'
    }
    setSaveHistory(prev => [saveRecord, ...prev])
    
    console.log('Settings updated:', newSettings)
  }

  const addMonitorUrl = (url) => {
    const updatedSettings = {
      ...settings,
      monitorUrls: [...settings.monitorUrls, { id: Date.now(), url }]
    }
    updateSettings(updatedSettings)
  }

  const removeMonitorUrl = (id) => {
    const updatedSettings = {
      ...settings,
      monitorUrls: settings.monitorUrls.filter(item => item.id !== id)
    }
    updateSettings(updatedSettings)
  }

  const clearAllData = () => {
    const emptySettings = {
      homeAddress: '',
      searchRadius: 10,
      interestTags: [],
      monitorUrls: []
    }
    setSettings(emptySettings)
    setWishListKeywords([])
    setSaveHistory([])
    localStorage.removeItem(getUserKey('preferences'))
    
    const clearRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      type: 'Clear All Data',
      data: 'All data cleared',
      status: 'Success'
    }
    setSaveHistory([clearRecord])
  }

  const deleteSaveRecord = (id) => {
    setSaveHistory(prev => prev.filter(record => record.id !== id))
  }

  const getFilteredEvents = () => {
    const futureEvents = getFutureEvents()
    return futureEvents.filter(event => 
      event.tags.some(tag => 
        wishListKeywords.some(keyword => 
          tag.toLowerCase().includes(keyword.toLowerCase())
        )
      )
    )
  }

  const value = {
    settings,
    events: getFutureEvents(),
    wishListKeywords,
    saveHistory,
    updateSettings,
    addMonitorUrl,
    removeMonitorUrl,
    setWishListKeywords,
    getFilteredEvents,
    clearAllData,
    deleteSaveRecord,
    hideEvent,
    unhideEvent,
    hiddenEvents
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}
