import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('talentflow-theme')
    return savedTheme || 'auto'
  })

  const [systemTheme, setSystemTheme] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Get the effective theme (resolved theme)
  const getEffectiveTheme = () => {
    if (theme === 'auto') {
      return systemTheme
    }
    return theme
  }

  // Apply theme to document
  const applyTheme = (effectiveTheme) => {
    const root = window.document.documentElement
    
    // Add smooth transition
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add new theme class
    root.classList.add(effectiveTheme)
    
    // Also set data attribute for additional styling options
    root.setAttribute('data-theme', effectiveTheme)
    
    // Remove transition after animation completes
    setTimeout(() => {
      root.style.transition = ''
    }, 300)
    
    // Debug log (remove in production)
    console.log(`Theme applied: ${effectiveTheme}`)
  }

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
      
      // If current theme is 'auto', apply the new system theme immediately
      if (theme === 'auto') {
        applyTheme(newSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  // Apply theme when theme or system theme changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme()
    applyTheme(effectiveTheme)
    
    // Save theme preference
    localStorage.setItem('talentflow-theme', theme)
  }, [theme, systemTheme])

  const changeTheme = (newTheme) => {
    console.log(`Changing theme from ${theme} to ${newTheme}`)
    setTheme(newTheme)
  }

  const effectiveTheme = getEffectiveTheme()

  return (
    <ThemeContext.Provider value={{ 
      theme: effectiveTheme, // Use effectiveTheme as the main theme value
      effectiveTheme, 
      systemTheme, 
      changeTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
