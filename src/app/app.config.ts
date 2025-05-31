import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { withInterceptors,provideHttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor'; // interceptor ka path sahi set kar lena

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideClientHydration(),

    // 👇 Yeh line add karo token inject karne ke liye
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    )
  ]
};
