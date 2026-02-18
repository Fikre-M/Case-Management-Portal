# JSDoc Documentation Templates

## React Component Template

```jsx
/**
 * Button component with multiple variants and states
 * 
 * A reusable button component that supports different variants (primary, secondary, danger),
 * sizes (small, medium, large), and states (loading, disabled).
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content (text, icons, etc.)
 * @param {'primary'|'secondary'|'danger'} [props.variant='primary'] - Button style variant
 * @param {'small'|'medium'|'large'} [props.size='medium'] - Button size
 * @param {boolean} [props.loading=false] - Shows loading spinner when true
 * @param {boolean} [props.disabled=false] - Disables button interaction
 * @param {Function} [props.onClick] - Click event handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - HTML button type
 * @param {...Object} props.rest - Additional props passed to button element
 * 
 * @returns {JSX.Element} Rendered button component
 * 
 * @example
 * // Basic usage
 * <Button onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * @example
 * // With variant and size
 * <Button variant="danger" size="large" onClick={handleDelete}>
 *   Delete Item
 * </Button>
 * 
 * @example
 * // Loading state
 * <Button loading disabled onClick={handleSubmit}>
 *   {loading ? 'Saving...' : 'Save'}
 * </Button>
 */
function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false, 
  onClick, 
  className = '', 
  type = 'button', 
  ...rest 
}) {
  // Component implementation
}
```

## Custom Hook Template

```jsx
/**
 * Custom hook for managing local storage state with React
 * 
 * Provides a stateful value that persists in localStorage and syncs
 * across browser tabs. Handles JSON serialization/deserialization
 * and provides error handling for storage operations.
 * 
 * @param {string} key - The localStorage key to use
 * @param {*} initialValue - Default value when no stored value exists
 * @returns {Array} Tuple containing [storedValue, setValue]
 * @returns {*} returns[0] - Current stored value
 * @returns {Function} returns[1] - Function to update the stored value
 * 
 * @throws {Error} When localStorage is not available
 * 
 * @example
 * function UserPreferences() {
 *   const [theme, setTheme] = useLocalStorage('theme', 'light')
 *   const [language, setLanguage] = useLocalStorage('language', 'en')
 * 
 *   return (
 *     <div>
 *       <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         Toggle Theme
 *       </button>
 *     </div>
 *   )
 * }
 */
function useLocalStorage(key, initialValue) {
  // Hook implementation
}
```

## Context Provider Template

```jsx
/**
 * Theme Context Provider
 * 
 * Manages application theme state (light/dark mode) with localStorage persistence
 * and system preference detection. Automatically applies theme classes to document.
 * 
 * @component
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components that will have access to theme context
 * 
 * @example
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <MainApp />
 *     </ThemeProvider>
 *   )
 * }
 */
export function ThemeProvider({ children }) {
  // Provider implementation
}

/**
 * Hook to access theme context
 * 
 * @returns {Object} Theme context object
 * @returns {string} returns.theme - Current theme ('light' or 'dark')
 * @returns {Function} returns.setTheme - Function to set theme
 * @returns {Function} returns.toggleTheme - Function to toggle between themes
 * 
 * @throws {Error} When used outside ThemeProvider
 * 
 * @example
 * function Header() {
 *   const { theme, toggleTheme } = useTheme()
 *   
 *   return (
 *     <header className={theme === 'dark' ? 'dark-header' : 'light-header'}>
 *       <button onClick={toggleTheme}>
 *         Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *       </button>
 *     </header>
 *   )
 * }
 */
export function useTheme() {
  // Hook implementation
}
```

## Service/Utility Function Template

```jsx
/**
 * Formats a date string for display
 * 
 * @param {string|Date} date - Date to format (ISO string or Date object)
 * @param {Object} [options={}] - Formatting options
 * @param {string} [options.format='short'] - Format type ('short', 'long', 'time', 'datetime')
 * @param {string} [options.locale='en-US'] - Locale for formatting
 * @param {string} [options.timezone] - Timezone for formatting
 * 
 * @returns {string} Formatted date string
 * 
 * @throws {Error} When date is invalid
 * 
 * @example
 * formatDate('2024-12-15') // "Dec 15, 2024"
 * formatDate('2024-12-15', { format: 'long' }) // "December 15, 2024"
 * formatDate('2024-12-15T14:30:00Z', { format: 'datetime' }) // "Dec 15, 2024 at 2:30 PM"
 */
export function formatDate(date, options = {}) {
  // Function implementation
}
```

## API Service Template

```jsx
/**
 * Appointment Service
 * 
 * Handles all appointment-related API operations including CRUD operations,
 * filtering, and data transformation. Provides consistent error handling
 * and response formatting.
 * 
 * @namespace appointmentService
 */
export const appointmentService = {
  /**
   * Retrieves all appointments from the API
   * 
   * @async
   * @function
   * @returns {Promise<Array<Object>>} Promise that resolves to array of appointments
   * @throws {Error} When API request fails
   * 
   * @example
   * try {
   *   const appointments = await appointmentService.getAll()
   *   console.log(`Found ${appointments.length} appointments`)
   * } catch (error) {
   *   console.error('Failed to load appointments:', error.message)
   * }
   */
  async getAll() {
    // Implementation
  },

  /**
   * Creates a new appointment
   * 
   * @async
   * @function
   * @param {Object} appointmentData - Appointment data to create
   * @param {string} appointmentData.title - Appointment title
   * @param {string} appointmentData.clientName - Client name
   * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Appointment time (HH:MM)
   * @returns {Promise<Object>} Promise that resolves to created appointment
   * @throws {Error} When creation fails or validation errors occur
   */
  async create(appointmentData) {
    // Implementation
  }
}
```

## Best Practices

### 1. Required JSDoc Tags
- `@param` - For all function parameters
- `@returns` - For return values (except void functions)
- `@throws` - For functions that can throw errors
- `@example` - At least one usage example
- `@component` - For React components
- `@async` - For async functions

### 2. Optional but Recommended Tags
- `@description` - Detailed description (can be first paragraph)
- `@since` - Version when added
- `@deprecated` - Mark deprecated functions
- `@see` - Reference related functions/components
- `@todo` - Mark incomplete implementations

### 3. Type Definitions
```jsx
/**
 * @typedef {Object} Appointment
 * @property {number} id - Unique identifier
 * @property {string} title - Appointment title
 * @property {string} clientName - Client name
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} time - Time in HH:MM format
 * @property {'scheduled'|'confirmed'|'completed'|'cancelled'} status - Appointment status
 */

/**
 * Creates a new appointment
 * @param {Appointment} appointmentData - The appointment to create
 * @returns {Promise<Appointment>} The created appointment
 */
```

### 4. Component Props Documentation
```jsx
/**
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {'primary'|'secondary'|'danger'} [variant='primary'] - Button variant
 * @property {boolean} [disabled=false] - Whether button is disabled
 * @property {Function} [onClick] - Click handler
 */

/**
 * Reusable button component
 * @param {ButtonProps} props - Component props
 */
```