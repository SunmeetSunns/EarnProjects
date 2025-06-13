import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AuthInterceptor } from './auth.interceptor'; // ✅ path check kar lena
import { SpinnerInterceptor } from './spinner.interceptor'; // ✅ path check kar lena

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideClientHydration(),

    provideHttpClient(
      withInterceptors([
        AuthInterceptor,
        SpinnerInterceptor // ✅ yeh line add ki
      ])
    )
  ]
};
