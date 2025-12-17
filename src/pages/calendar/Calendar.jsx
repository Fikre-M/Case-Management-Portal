import { useState } from 'react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import { useApp } from '../../context/AppContext'

function Calendar() {
  const { appointments } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // Create calendar grid
  const calendarDays = []
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }
  
  // Get appointments for a specific date
  const getAppointmentsForDate = (day) => {
    if (!day) return []
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(apt => apt.date === dateStr)
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentYear, currentMonth + direction, 1))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day)
            const isToday = day && 
              new Date().getDate() === day && 
              new Date().getMonth() === currentMonth && 
              new Date().getFullYear() === currentYear
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                  day ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-900'
                } ${isToday ? 'ring-2 ring-primary-500' : ''} transition-colors`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          className="text-xs p-1 rounded bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 truncate"
                          title={`${apt.time} - ${apt.title}`}
                        >
                          {apt.time} {apt.clientName}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Today's Appointments */}
      <Card title="Today's Appointments">
        {appointments.filter(apt => {
          const today = new Date().toISOString().split('T')[0]
          return apt.date === today
        }).length > 0 ? (
          <div className="space-y-3">
            {appointments.filter(apt => {
              const today = new Date().toISOString().split('T')[0]
              return apt.date === today
            }).map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{apt.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{apt.clientName} • {apt.time}</p>
                </div>
                <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'}>
                  {apt.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No appointments today</p>
        )}
      </Card>
    </div>
  )
}

export default Calendar
