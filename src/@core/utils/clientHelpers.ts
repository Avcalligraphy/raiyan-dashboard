// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

/**
 * Client-side cookie helper functions
 * These functions work in the browser environment and read cookies from document.cookie
 */

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
const getCookie = (name: string): string | null => {
  // Check if we're in a browser environment
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  
  return null
}

/**
 * Get settings from cookie
 * @returns Settings object from cookie or empty object
 */
export const getSettingsFromCookie = (): Settings => {
  const cookieName = themeConfig.settingsCookieName
  const cookieValue = getCookie(cookieName)

  if (!cookieValue) return {}

  try {
    return JSON.parse(cookieValue) as Settings
  } catch (error) {
    console.warn('Failed to parse settings cookie:', error)
    return {}
  }
}

/**
 * Get theme mode from cookie or config
 * @returns Theme mode string
 */
export const getMode = (): string => {
  const settingsCookie = getSettingsFromCookie()

  // Get mode from cookie or fallback to theme config
  return settingsCookie.mode || themeConfig.mode
}

/**
 * Get system mode (light/dark) based on user preference or cookie
 * @returns SystemMode value
 */
export const getSystemMode = (): SystemMode => {
  const mode = getMode()
  
  // If mode is 'system', check for colorPref cookie or use system preference
  if (mode === 'system') {
    const colorPrefCookie = getCookie('colorPref')
    
    if (colorPrefCookie && (colorPrefCookie === 'light' || colorPrefCookie === 'dark')) {
      return colorPrefCookie as SystemMode
    }
    
    // Fallback to system preference if available
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    
    return 'light'
  }
  
  // If mode is not 'system', return the mode directly
  return (mode === 'light' || mode === 'dark') ? (mode as SystemMode) : 'light'
}

/**
 * Get the actual mode (resolves 'system' to light/dark)
 * @returns SystemMode value (light or dark)
 */
export const getResolvedMode = (): SystemMode => {
  const mode = getMode()
  const systemMode = getSystemMode()

  return mode === 'system' ? systemMode : (mode as SystemMode)
}

/**
 * Get skin setting from cookie or config
 * @returns Skin value
 */
export const getSkin = (): string => {
  const settingsCookie = getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}

/**
 * Set a cookie value
 * @param name - Cookie name
 * @param value - Cookie value
 * @param days - Number of days until expiration (default: 365)
 */
export const setCookie = (name: string, value: string, days: number = 365): void => {
  if (typeof document === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`
}

/**
 * Delete a cookie
 * @param name - Cookie name
 */
export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}
