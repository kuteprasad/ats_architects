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
      'view_applications'
      
    ],
    [ROLES.INTERVIEWER]: [
      'view_applications',
      'view_job_postings'
      // 'manage_applications',
    ],
    [ROLES.ADMIN]: [
      'job_postings',
      'schedule_interview',
      'view_applications',
      'view_job_postings',
      // 'all_permissions'
    ]
  };
  
  export const hasPermission = (userRole, permission) => {
    return permissionMap[userRole]?.includes(permission) || false;
  };