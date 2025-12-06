import { formatTime } from '../../utils/formatters'

function ChatMessage({ message }) {
  const isUser = message.type === 'user'
  const isError = message.isError

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-primary-500' 
          : isError 
            ? 'bg-red-100 dark:bg-red-900/20'
            : 'bg-primary-100 dark:bg-primary-900/20'
      }`}>
        <span className="text-lg">
          {isUser ? '👤' : isError ? '⚠️' : '🤖'}
        </span>
      </div>

      {/* Message Bubble */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white rounded-tr-none'
            : isError
              ? 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-200 rounded-tl-none'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
        }`}>
          {/* Message Content */}
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isUser 
              ? 'text-primary-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {formatTime(new Date(message.timestamp))}
          </div>
        </div>

        {/* Actions (for assistant messages) */}
        {!isUser && !isError && (
          <div className="flex items-center space-x-2 mt-2">
            <button
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Copy message"
            >
              📋 Copy
            </button>
            <button
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Regenerate response"
            >
              🔄 Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
