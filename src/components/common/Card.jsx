function Card({ children, title, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>}
      {children}
    </div>
  )
}

export default Card
