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
  
  const [settings, setSettings] = useState({
    homeAddress: '',
    searchRadius: 10,
    interestTags: [],
    monitorUrls: [],
    emailAddress: '',
    phoneNumber: '',
    notificationMethod: 'both',
    distanceUnit: 'km',
    freeTextSearch: ''
  })

  const [wishListKeywords, setWishListKeywords] = useState(['technology'])
  const [hiddenEvents, setHiddenEvents] = useState([])

  const [events] = useState([
    {
      id: 1,
      name: 'Tech Conference 2024',
      sourceSite: 'Eventbrite',
      distance: 5.2,
      registerUrl: 'https://www.eventbrite.com',
      eventDate: '2026-02-15T10:00:00Z',
      price: '$299',
      location: 'Convention Center'
    },
    {
      id: 2,
      name: 'Music Festival',
      sourceSite: 'Ticketmaster',
      distance: 12.8,
      registerUrl: 'https://www.ticketmaster.com',
      eventDate: '2026-07-20T18:00:00Z',
      price: 'Free',
      location: 'City Park'
    }
  ])

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem(getUserKey('preferences'), JSON.stringify({
      ...newSettings,
      wishListKeywords,
      apiKey: 'f90220f746cb49a0bfbf914e4c78bd91',
      webhookSecret: 'SagiEventMonitor2026',
      user: currentUser
    }))
  }

  const hideEvent = (eventId) => {
    setHiddenEvents(prev => [...prev, eventId])
  }

  const getFilteredEvents = () => {
    return events.filter(event => !hiddenEvents.includes(event.id))
  }

  return (
    <EventContext.Provider value={{
      settings,
      events: getFilteredEvents(),
      wishListKeywords,
      updateSettings,
      setWishListKeywords,
      hideEvent,
      getFilteredEvents
    }}>
      {children}
    </EventContext.Provider>
  )
}
