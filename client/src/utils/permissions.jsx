export const ROLES = {
    INTERVIEWER: 'interviewer',
    HR: 'HR',
    ADMIN: 'admin'
  };
  
  export const checkPermission = (userRole, requiredRoles) => {
    return requiredRoles.includes(userRole);
  };
  
  export const permissionMap = {
    [ROLES.HR]: [
      // 'job_postings',
      // 'schedule_interview',
      'view_applications',
      'handle_analytics',
      'view_job_postings',
      'HR-dashboard',
      'candidate-history'
      // 'seeding_db',
      // 'process_emails',
      // 'score_resumes'
      
    ],
    [ROLES.INTERVIEWER]: [
      'view_applications',
      'view_job_postings',
      'my_interviews',
      'interviewer-dashboard'
      // 'manage_applications',
    ],
    [ROLES.ADMIN]: [
      'job_postings',
      'candidates_history',
      'schedule_interview',
      'view_applications',
      'view_job_postings',
      // 'seeding_db',
      'process_emails',
      'handle_analytics',
      'score_resumes',
      'Recruiter-dashboard',
      'candidate-history'
      // 'all_permissions'
    ]
  };
  
  export const hasPermission = (userRole, permission) => {
    return permissionMap[userRole]?.includes(permission) || false;
  };