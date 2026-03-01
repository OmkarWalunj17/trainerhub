import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('accesstoken');
  const userRole = localStorage.getItem('userRole');

  if(!token){
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as Array<string>;

  if(allowedRoles && !allowedRoles.includes(userRole!)){
    router.navigate(['/error']);
    return false;
  }
  return true;
};
