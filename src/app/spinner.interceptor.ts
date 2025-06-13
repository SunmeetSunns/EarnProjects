import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { LoaderService } from './services/loader.service';

export const SpinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const spinnerService = inject(LoaderService);
  const startTime = Date.now(); // 📌 Spinner start time
  let alreadyHidden = false;

  spinnerService.show();

  const hideSpinner = () => {
    if (!alreadyHidden) {
      spinnerService.hide();
      alreadyHidden = true;
    }
  };

  const ensureMinTimeThenHide = () => {
    const elapsed = Date.now() - startTime;
    const remaining = 3000 - elapsed;

    if (remaining > 0) {
      setTimeout(() => hideSpinner(), remaining);
    } else {
      hideSpinner();
    }
  };

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          ensureMinTimeThenHide();
        }
      },
      error: (err: HttpErrorResponse) => {
        ensureMinTimeThenHide();
      }
    }),
    finalize(() => {
      // Backup safety in case neither next/error triggers hide
      ensureMinTimeThenHide();
    })
  );
};
