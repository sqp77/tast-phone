import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';

let activeRequests = 0;
let loadingEl: HTMLIonLoadingElement | null = null;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip loading for background requests
  if (req.headers.has('X-Skip-Loading')) return next(req);

  const loadingCtrl = inject(LoadingController);

  if (activeRequests === 0) {
    loadingCtrl.create({
      spinner: 'crescent',
      cssClass: 'app-loading',
    }).then(el => {
      loadingEl = el;
      el.present();
    });
  }
  activeRequests++;

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0 && loadingEl) {
        loadingEl.dismiss();
        loadingEl = null;
      }
    })
  );
};
