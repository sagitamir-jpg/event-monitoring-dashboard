import axios from 'axios'

// Base44 Auto-Sync Service
class Base44Service {
  constructor() {
    // Base44 API configuration
    this.apiEndpoint = process.env.REACT_APP_BASE44_API_URL || ''
    this.apiKey = process.env.REACT_APP_BASE44_API_KEY || ''
    this.webhookUrl = process.env.REACT_APP_BASE44_WEBHOOK_URL || ''
  }

  // Auto-sync settings to Base44
  async syncToBase44(userSettings, currentUser) {
    try {
      console.log('🔄 Auto-syncing to Base44...')
      
      // Prepare data for Base44
      const base44Data = {
        user: currentUser,
        lastUpdated: new Date().toISOString(),
        homeAddress: userSettings.homeAddress,
        searchRadius: userSettings.searchRadius,
        interestTags: userSettings.interestTags,
        monitorUrls: userSettings.monitorUrls,
        emailAddress: userSettings.emailAddress,
        phoneNumber: userSettings.phoneNumber,
        notificationMethod: userSettings.notificationMethod,
        smsForAllEvents: userSettings.smsForAllEvents,
        smsForWishListOnly: userSettings.smsForWishListOnly,
        urgentSmsNotifications: userSettings.urgentSmsNotifications,
        emailDailyDigest: userSettings.emailDailyDigest,
        emailInstantAlerts: userSettings.emailInstantAlerts,
        emailWeeklyReport: userSettings.emailWeeklyReport,
        distanceUnit: userSettings.distanceUnit,
        customCategories: userSettings.customCategories,
        freeTextSearch: userSettings.freeTextSearch,
        wishListKeywords: userSettings.wishListKeywords,
        apiKey: 'f90220f746cb49a0bfbf914e4c78bd91',
        webhookSecret: 'SagiEventMonitor2026'
      }

      // 🎯 TEST MULTIPLE BASE44 ENDPOINTS
      const base44AppUrl = 'https://event-scout-69827fe9.base44.app'
      const testEndpoints = [
        `${base44AppUrl}/api/update`,
        `${base44AppUrl}/webhook`,
        `${base44AppUrl}/data`,
        `${base44AppUrl}/api/data`,
        `${base44AppUrl}/sync`,
        `${base44AppUrl}/`
      ]

      console.log('🔍 Testing Base44 endpoints...')
      
      for (const endpoint of testEndpoints) {
        try {
          console.log(`🧪 Testing: ${endpoint}`)
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer f90220f746cb49a0bfbf914e4c78bd91`,
              'X-API-Key': 'f90220f746cb49a0bfbf914e4c78bd91'
            },
            body: JSON.stringify(base44Data)
          })

          console.log(`📊 ${endpoint} → Status: ${response.status}`)
          
          if (response.ok) {
            console.log(`✅ SUCCESS! Base44 endpoint found: ${endpoint}`)
            return { 
              success: true, 
              method: 'Base44 API',
              endpoint: endpoint,
              status: response.status
            }
          }
          
          // Log response for debugging
          const responseText = await response.text()
          console.log(`📝 Response from ${endpoint}:`, responseText.substring(0, 200))
          
        } catch (error) {
          console.log(`❌ ${endpoint} failed:`, error.message)
        }
      }

      // Method 2: Use environment variables if set
      if (this.apiEndpoint && this.apiKey) {
        try {
          const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'X-API-Key': this.apiKey
            },
            body: JSON.stringify(base44Data)
          })

          if (response.ok) {
            console.log('✅ Successfully synced to Base44 via configured API')
            return { success: true, method: 'Configured API' }
          }
        } catch (error) {
          console.log('❌ Configured API failed:', error.message)
        }
      }

      // Method 3: Use webhook URL if set
      if (this.webhookUrl) {
        try {
          const response = await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(base44Data)
          })

          if (response.ok) {
            console.log('✅ Successfully synced to Base44 via webhook')
            return { success: true, method: 'Webhook' }
          }
        } catch (error) {
          console.log('❌ Webhook failed:', error.message)
        }
      }

      // Method 4: Fallback - show manual copy instructions
      console.warn('⚠️ No working Base44 endpoint found - manual copy required')
      console.log('💡 Check F12 console above to see which endpoints were tested')
      return { 
        success: false, 
        method: 'Manual',
        message: 'No working Base44 API endpoint found. Please copy JSON from Developer tab to Base44 manually.',
        testedEndpoints: testEndpoints
      }

    } catch (error) {
      console.error('❌ Base44 sync failed:', error)
      return { 
        success: false, 
        method: 'Error',
        error: error.message 
      }
    }
  }

  // Test Base44 connection
  async testConnection() {
    try {
      if (this.apiEndpoint && this.apiKey) {
        const response = await fetch(`${this.apiEndpoint}/test`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-API-Key': this.apiKey
          }
        })
        return response.ok
      }
      return false
    } catch (error) {
      console.error('Base44 connection test failed:', error)
      return false
    }
  }
}

const base44Service = new Base44Service()

// Legacy functions for backward compatibility
export const savePreferencesToFile = async (settings) => {
  try {
    const preferences = {
      lastUpdated: new Date().toISOString(),
      homeAddress: settings.homeAddress,
      searchRadius: settings.searchRadius,
      interestTags: settings.interestTags,
      monitorUrls: settings.monitorUrls.map(item => item.url),
      wishListKeywords: settings.wishListKeywords || [],
      apiKey: process.env.REACT_APP_BASE44_API_KEY,
      webhookSecret: process.env.REACT_APP_WEBHOOK_SECRET
    }
    
    // Save to localStorage for Base44 to access
    localStorage.setItem('kiro-user-preferences', JSON.stringify(preferences))
    
    console.log('✅ Preferences saved for Base44:', preferences)
    return { success: true, data: preferences }
  } catch (error) {
    console.error('❌ Failed to save preferences:', error)
    throw error
  }
}

export const triggerBase44Automation = async (settings) => {
  try {
    // Save preferences locally first
    await savePreferencesToFile(settings)
    
    console.log('🚀 Base44 Automation Triggered with settings:', settings)
    console.log('🔑 API Key:', process.env.REACT_APP_BASE44_API_KEY)
    console.log('🔐 Webhook Secret:', process.env.REACT_APP_WEBHOOK_SECRET)
    
    return {
      success: true,
      message: 'Preferences saved successfully. Base44 can now read from localStorage or user-preferences.json file.',
      timestamp: new Date().toISOString(),
      dataLocation: 'localStorage key: kiro-user-preferences'
    }
  } catch (error) {
    console.error('Base44 automation trigger failed:', error)
    throw error
  }
}

// Get current preferences (for Base44 to call)
export const getUserPreferences = () => {
  try {
    const stored = localStorage.getItem('kiro-user-preferences')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to get user preferences:', error)
    return null
  }
}

export const geocodeAddress = async (address) => {
  try {
    // Mock geocoding service - replace with actual service
    const response = await axios.get(`https://api.geocoding.com/v1/geocode`, {
      params: { address },
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GEOCODING_API_KEY}`
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Geocoding failed:', error)
    // Return mock coordinates for demo
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      formatted_address: address
    }
  }
}

export default base44Service
