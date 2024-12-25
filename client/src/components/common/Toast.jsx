// components/common/Toast.js
import React, { useEffect, useState } from 'react';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 5000, 
  onClose 
}) => {
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Start countdown timer
    const startTime = Date.now();
    const id = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = Math.max(0, 100 - (elapsedTime / duration) * 100);
      
      if (remainingProgress === 0) {
        clearInterval(id);
        onClose();
      } else {
        setProgress(remainingProgress);
      }
    }, 10); // Update every 10ms for smooth animation

    setIntervalId(id);

    // Cleanup on unmount or when message changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [duration, onClose]);

  return (
    <div className="relative overflow-hidden rounded shadow-lg">
      {/* Main toast content */}
      <div
        className={`p-4 ${
          type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message}
      </div>
      
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200 absolute bottom-0 left-0">
        <div
          className={`h-full transition-all duration-100 ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;