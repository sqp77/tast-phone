import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { from, map } from 'rxjs';

const ONBOARDING_KEY = 'se_onboarding_done';

export const onboardingGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  return from(storage.get(ONBOARDING_KEY)).pipe(
    map(done => {
      if (done === 'true') return router.createUrlTree(['/auth/login']);
      return true;
    })
  );
};
