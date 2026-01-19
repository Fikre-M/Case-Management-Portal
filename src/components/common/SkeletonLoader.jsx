import { motion } from 'framer-motion'

const shimmer = {
  hidden: { x: '-100%' },
  visible: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
}

function SkeletonLoader({ className = '', variant = 'default' }) {
  const variants = {
    default: 'h-4 bg-gray-200 dark:bg-gray-700 rounded',
    card: 'h-32 bg-gray-200 dark:bg-gray-700 rounded-lg',
    avatar: 'h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full',
    button: 'h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg',
    text: 'h-3 bg-gray-200 dark:bg-gray-700 rounded',
    title: 'h-6 bg-gray-200 dark:bg-gray-700 rounded'
  }

  return (
    <div className={`relative overflow-hidden ${variants[variant]} ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20"
        variants={shimmer}
        initial="hidden"
        animate="visible"
      />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Skeleton */}
      <div className="space-y-2">
        <SkeletonLoader variant="title" className="w-48" />
        <SkeletonLoader variant="text" className="w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <SkeletonLoader variant="text" className="w-20" />
                <SkeletonLoader variant="title" className="w-16" />
                <SkeletonLoader variant="text" className="w-24" />
              </div>
              <SkeletonLoader variant="avatar" className="w-12 h-12 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <SkeletonLoader variant="title" className="w-40 mb-4" />
          <SkeletonLoader variant="card" className="h-64" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <SkeletonLoader variant="title" className="w-32 mb-4" />
          <SkeletonLoader variant="card" className="h-64" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SkeletonLoader