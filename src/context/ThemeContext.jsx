import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()

// Helper function to get the initial theme
const getInitialTheme = () => {
  // Check for saved theme preference
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove previous theme class
    root.classList.remove('light', 'dark')
    // Add current theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
