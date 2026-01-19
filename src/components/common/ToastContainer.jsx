import { AnimatePresence } from 'framer-motion'
import Toast from './Toast'

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-full">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer
