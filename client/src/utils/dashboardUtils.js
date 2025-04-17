// dashboardUtils.js

export const getInitialPermissions = () => ({
    canCreateJobs: false,
    canDoDbSeeding: false,
    canHaveInterviews: false,
    canProcessEmails: false,
    canScoreResumes: false,
    canSeeRecuiterDashboard: false,
    canSeeHRDashboard: false,
    canSeeInterviewerDashboard: false,
    canSeeCandidateHistory: false,
    canCandidatesHistory: false,
  });
  
  export const updatePermissions = (user, hasPermission) => ({
    canCreateJobs: hasPermission(user.role, "job_postings"),
    canDoDbSeeding: hasPermission(user.role, "seeding_db"),
    canHaveInterviews: hasPermission(user.role, "my_interviews"),
    canProcessEmails: hasPermission(user.role, "process_emails"),
    canScoreResumes: hasPermission(user.role, "score_resumes"),
    canHandleAnalytics: hasPermission(user.role, 'handle_analytics'),
    canSeeRecuiterDashboard: hasPermission(user.role, 'Recruiter-dashboard'),
    canSeeHRDashboard: hasPermission(user.role, 'HR-dashboard'),
    canSeeInterviewerDashboard: hasPermission(user.role, 'interviewer-dashboard'),
    canSeeCandidateHistory: hasPermission(user.role, 'candidate-history'),
    canCandidatesHistory: hasPermission(user.role, 'candidates_history')
  });