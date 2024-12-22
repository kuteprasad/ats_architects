import React from 'react';
import Button from './Button';

const ResumeViewer = ({ resume }) => {
  const handleViewResume = async () => {
    try {
      // Convert BLOB data to Uint8Array
      const uint8Array = new Uint8Array(resume.data);

      // Create Blob object
      const blob = new Blob([uint8Array], {
        type: "application/pdf",
      });

      // Create URL for blob
      const url = window.URL.createObjectURL(blob);

      // Open in new window
      window.open(url);

      // Clean up URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Error viewing resume:', err);
      alert('Failed to load resume');
    }
  };

  return (
    <Button
      onClick={handleViewResume}
      variant="secondary"
      size="sm"
      className="flex items-center gap-2"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
      View Resume
    </Button>
  );
};

export default ResumeViewer;