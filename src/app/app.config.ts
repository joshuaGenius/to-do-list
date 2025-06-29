import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"joshuatask-58115","appId":"1:48338613278:web:11cbcf6da581f19179ea0f","storageBucket":"joshuatask-58115.firebasestorage.app","apiKey":"AIzaSyCUGFdFdhJ1_jhmGZxYMKmNxtSojWksFbM","authDomain":"joshuatask-58115.firebaseapp.com","messagingSenderId":"48338613278","measurementId":"G-NELDXDSJ0F"})), provideFirestore(() => getFirestore()), provideAnimationsAsync()
    ,    importProvidersFrom(MatNativeDateModule)

  ]
};
