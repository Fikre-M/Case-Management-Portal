import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function SearchBar({ onSearch, placeholder = "Search...", suggestions = [] }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  // Fuzzy search function
  const fuzzySearch = (items, query) => {
    if (!query) return []
    
    const searchQuery = query.toLowerCase()
    return items
      .map(item => {
        const text = typeof item === 'string' ? item : item.title || item.name || ''
        const lowerText = text.toLowerCase()
        
        // Calculate match score
        let score = 0
        let queryIndex = 0
        
        for (let i = 0; i < lowerText.length && queryIndex < searchQuery.length; i++) {
          if (lowerText[i] === searchQuery[queryIndex]) {
            score += 1
            queryIndex++
          }
        }
        
        // Bonus for exact matches and word starts
        if (lowerText.includes(searchQuery)) score += 10
        if (lowerText.startsWith(searchQuery)) score += 20
        
        return { item, score, text }
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }

  const filteredSuggestions = fuzzySearch(suggestions, query)

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    setIsOpen(value.length > 0)
    onSearch?.(value)
  }

  const handleKeyDown = (e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          const selected = filteredSuggestions[selectedIndex]
          setQuery(selected.text)
          setIsOpen(false)
          onSearch?.(selected.text)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text)
    setIsOpen(false)
    onSearch?.(suggestion.text)
    inputRef.current?.focus()
  }

  const highlightMatch = (text, query) => {
    if (!query) return text
    
    const regex = new RegExp(`(${query.split('').join('.*?')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100">
          {part}
        </mark>
      ) : part
    )
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={resultsRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </motion.svg>
        </div>

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              onSearch?.('')
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  index === selectedIndex ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500' : ''
                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="text-sm text-gray-900 dark:text-white">
                  {highlightMatch(suggestion.text, query)}
                </div>
                {suggestion.item.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {suggestion.item.description}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar