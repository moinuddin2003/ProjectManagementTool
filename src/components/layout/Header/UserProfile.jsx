import React from 'react';
import { User } from 'lucide-react';

const UserProfile = ({ 
  name = "Carter Kenter", 
  role = "Project Manager" 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right hidden sm:block">
        <div className="text-sm font-semibold text-gray-900">{name}</div>
        <div className="text-xs text-gray-600">{role}</div>
      </div>
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
        <User className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

export default UserProfile;
