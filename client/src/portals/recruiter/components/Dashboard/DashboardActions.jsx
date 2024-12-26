// components/Dashboard/DashboardActions.js
import React from 'react';
import Button from '../../../../components/common/Button';
import Toast from '../../../../components/common/Toast';


const DashboardActions = ({ 
  permissions, 
  onCreateJob, 
  onSeeding, 
  onProcessEmails,
  onScoreResumes,
  onAnalytics,
  onMyInterview,
  scoreLoading,
  emailProcessing,
  scoreMessage,
  emailMessage,
  onClearScoreMessage,
  onClearEmailMessage 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        {permissions.canCreateJobs && (
          <Button 
            onClick={onCreateJob} 
            variant="primary" 
            size="md"
          >
            Create Job Posting
          </Button>
        )}

        {permissions.canScoreResumes && (
          <Button
            onClick={onScoreResumes}
            loading={scoreLoading}
            loadingChildren="Processing Resumes..."
            variant="primary"
          >
            Update Resume Scores
          </Button>
        )}

        {permissions.canDoDbSeeding && (
          <Button 
            onClick={onSeeding} 
            variant="primary" 
            size="md"
          >
            Seed Database
          </Button>
        )}

        {permissions.canProcessEmails && (
          <Button
            onClick={onProcessEmails}
            loading={emailProcessing}
            loadingChildren="Processing Emails..."
            variant="primary"
            size="md"
          >
            Check Email for new Applications
          </Button>
        )}

        {permissions.canHandleAnalytics && (
          <Button 
            onClick={onAnalytics} 
            variant="primary" 
            size="md"
            className='ml-4'
          >
            View Analytics
          </Button>
        )}

        {permissions.canHaveInterviews && (
          <Button
            onClick={onMyInterview}
            variant="primary"
            size="md"
            className="ml-4"
          >
            My Interviews
          </Button>
        )}
      </div>

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {scoreMessage && (
          <Toast
            message={scoreMessage.text}
            type={scoreMessage.type}
            onClose={onClearScoreMessage}
          />
        )}
        
        {emailMessage && (
          <Toast
            message={emailMessage.text}
            type={emailMessage.type}
            onClose={onClearEmailMessage}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardActions;