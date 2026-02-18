import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'

/**
 * Optimized Appointment Chart with memoization for 2026 performance standards
 * 
 * Uses React.memo and useMemo to prevent expensive re-renders of chart data.
 * Targets <100ms interaction delays and smooth 60fps animations.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.data] - Chart data array
 * @param {boolean} [props.animate=true] - Enable chart animations
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Memoized chart component
 */
const AppointmentChart = memo(function AppointmentChart({ 
  data: propData, 
  animate = true, 
  className = '' 
}) {
  // Memoize default data to prevent recreation on every render
  const defaultData = useMemo(() => [
    { name: 'Jan', appointments: 12, completed: 10 },
    { name: 'Feb', appointments: 19, completed: 16 },
    { name: 'Mar', appointments: 15, completed: 13 },
    { name: 'Apr', appointments: 22, completed: 20 },
    { name: 'May', appointments: 28, completed: 25 },
    { name: 'Jun', appointments: 24, completed: 22 },
  ], [])

  // Use provided data or fallback to default
  const chartData = propData || defaultData

  // Memoize chart configuration to prevent Recharts re-initialization
  const chartConfig = useMemo(() => ({
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
    lines: [
      {
        dataKey: 'appointments',
        stroke: '#0ea5e9',
        strokeWidth: 3,
        dot: { fill: '#0ea5e9', strokeWidth: 2, r: 4 },
        activeDot: { r: 6, stroke: '#0ea5e9', strokeWidth: 2 }
      },
      {
        dataKey: 'completed',
        stroke: '#10b981',
        strokeWidth: 3,
        dot: { fill: '#10b981', strokeWidth: 2, r: 4 },
        activeDot: { r: 6, stroke: '#10b981', strokeWidth: 2 }
      }
    ]
  }), [])

  // Memoize tooltip style to prevent object recreation
  const tooltipStyle = useMemo(() => ({
    backgroundColor: 'var(--tooltip-bg)',
    border: '1px solid var(--tooltip-border)',
    borderRadius: '8px',
    color: 'var(--tooltip-text)'
  }), [])

  // Memoize animation props
  const animationProps = useMemo(() => 
    animate ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: 0.2 }
    } : {}
  , [animate])

  return (
    <motion.div
      {...animationProps}
      className={`h-64 ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={chartConfig.margin}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
          <Tooltip contentStyle={tooltipStyle} />
          {chartConfig.lines.map((lineConfig, index) => (
            <Line 
              key={lineConfig.dataKey}
              type="monotone" 
              dataKey={lineConfig.dataKey}
              stroke={lineConfig.stroke}
              strokeWidth={lineConfig.strokeWidth}
              dot={lineConfig.dot}
              activeDot={lineConfig.activeDot}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
})

AppointmentChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    appointments: PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired
  })),
  animate: PropTypes.bool,
  className: PropTypes.string
}

export default AppointmentChart