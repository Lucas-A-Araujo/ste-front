import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  show: boolean;
}

export const Notification: React.FC<NotificationProps> = ({ type, message, onClose, show }) => {
  if (!show) return null;

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const borderColor = type === "success" ? "border-green-200" : "border-red-200";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";
  const iconColor = type === "success" ? "text-green-400" : "text-red-400";
  const Icon = type === "success" ? FaCheckCircle : FaExclamationTriangle;

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} border ${borderColor} rounded-md p-4 shadow-lg max-w-sm`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className={`inline-flex ${textColor} hover:${type === "success" ? "text-green-600" : "text-red-600"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === "success" ? "green" : "red"}-500`}
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 