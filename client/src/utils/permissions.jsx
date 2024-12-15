export const ROLES = {
    CANDIDATE: 'candidate',
    RECRUITER: 'recruiter',
    ADMIN: 'admin'
  };
  
  export const checkPermission = (userRole, requiredRoles) => {
    return requiredRoles.includes(userRole);
  };
  
  export const permissionMap = {
    [ROLES.CANDIDATE]: [
      'view_profile',
      'update_profile',
      'apply_job',
      'view_applications'
    ],
    [ROLES.RECRUITER]: [
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