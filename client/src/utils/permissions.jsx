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
      // 'view_profile',
      // 'update_profile',
      // 'apply_job',
      'view_applications',
      'handle_analytics'
      
    ],
    [ROLES.INTERVIEWER]: [
      'view_applications',
      'view_job_postings',
      'my_interviews'
      // 'manage_applications',
    ],
    [ROLES.ADMIN]: [
      'job_postings',
      'schedule_interview',
      'view_applications',
      'view_job_postings',
      'seeding_db',
      'process_emails',
      'handle_analytics'
      // 'all_permissions'
    ]
  };
  
  export const hasPermission = (userRole, permission) => {
    return permissionMap[userRole]?.includes(permission) || false;
  };