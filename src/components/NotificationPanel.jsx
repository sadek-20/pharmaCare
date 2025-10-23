"use client"

import { useState } from "react"

function NotificationPanel({ onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Paracetamol stock is low (15 units remaining)", type: "warning", read: false },
    { id: 2, message: "Aspirin expires in 7 days", type: "danger", read: false },
    { id: 3, message: "New order received from Customer #1234", type: "info", read: true },
    { id: 4, message: "Ibuprofen stock is low (8 units remaining)", type: "warning", read: false },
  ])

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "danger":
        return "bg-red-50 border-red-200 text-red-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center gap-2">
          <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-700">
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className={`text-sm p-3 rounded-lg border ${getTypeColor(notification.type)}`}>
                {notification.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
