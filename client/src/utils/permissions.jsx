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
      'view_profile',
      'update_profile',
      'apply_job',
      'view_applications'
    ],
    [ROLES.INTERVIEWER]: [
      'create_job',
      'view_candidates',
      'manage_applications',
      'schedule_interview'
    ],
    [ROLES.ADMIN]: [
      'all_permissions'
    ]
  };
  
  export const hasPermission = (userRole, permission) => {
    return permissionMap[userRole]?.includes(permission) || false;
  };