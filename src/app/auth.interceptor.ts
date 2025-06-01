// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginServiceService } from './services/login-service.service';  // adjust path

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('authToken');
  const router = inject(Router);
  const loginService = inject(LoginServiceService); // ✅ inject service

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err.status === 401) {
          sessionStorage.clear();
          loginService.setLoginStatus(false); // ✅ logout reactively
          router.navigate(['/login']);
        }
      }
    })
  );
};
