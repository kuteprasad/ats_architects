
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import Button from '../../../../components/common/Button';


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
  emailMessage 
}) => {
  return (
    <div className="mb-6 flex items-center gap-4">
      {permissions.canCreateJobs && (
        <Button onClick={onCreateJob} variant="primary" size="md">
          Create Job Posting
        </Button>
      )}

      {permissions.canScoreResumes && (
        <div>
          <Button
            onClick={onScoreResumes}
            disabled={scoreLoading}
            variant="primary"
            className="flex items-center gap-2"
          >
            {scoreLoading ? (
              <>
                <LoadingSpinner />
                Processing Resumes...
              </>
            ) : (
              "Update Resume Scores"
            )}
          </Button>
        </div>
      )}

      {permissions.canDoDbSeeding && (
        <Button onClick={onSeeding} variant="primary" size="md">
          Seed Database
        </Button>
      )}

      {permissions.canProcessEmails && (
        <div>
          <Button
            onClick={onProcessEmails}
            variant="primary"
            size="md"
            disabled={emailProcessing}
            className="flex items-center gap-2"
          >
            {emailProcessing ? (
              <>
                <LoadingSpinner />
                Processing Emails...
              </>
            ) : (
              "Check Email for new Applications"
            )}
          </Button>
        </div>
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
          variant="secondary"
          size="md"
          className="ml-4"
        >
          My Interviews
        </Button>
      )}

      {scoreMessage && (
        <div
          className={`mt-4 p-4 rounded ${
            scoreMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {scoreMessage.text}
        </div>
      )}
      
      {emailMessage && (
        <div
          className={`mt-4 p-4 rounded ${
            emailMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {emailMessage.text}
        </div>
      )}
    </div>
  );
};

export default DashboardActions;