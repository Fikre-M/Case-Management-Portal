import { motion } from 'framer-motion'

function Card({ children, title, className = '', hover = true, ...props }) {
  const cardVariants = {
    initial: { y: 0, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)" },
    hover: { 
      y: -2, 
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  }

  return (
    <motion.div
      variants={hover ? cardVariants : {}}
      initial="initial"
      whileHover={hover ? "hover" : "initial"}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      {children}
    </motion.div>
  )
}

export default Card

export default Card
