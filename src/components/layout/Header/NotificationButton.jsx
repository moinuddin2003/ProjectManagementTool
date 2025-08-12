import React from 'react';
import { Bell } from 'lucide-react';

const NotificationButton = ({ hasNotifications = true }) => {
  return (
    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
      <Bell className="w-5 h-5 text-gray-600" />
      {hasNotifications && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </button>
  );
};

export default NotificationButton;