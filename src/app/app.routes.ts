import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  { path: 'splash', loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage) },
  { path: 'onboarding', loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage), canActivate: [onboardingGuard] },
  {
    path: 'auth',
    children: [
      { path: 'login',    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.tabsRoutes), canActivate: [authGuard] },
  { path: 'cities',          loadComponent: () => import('./pages/cities/cities.page').then(m => m.CitiesPage),               canActivate: [authGuard] },
  { path: 'cities/:id',      loadComponent: () => import('./pages/city-detail/city-detail.page').then(m => m.CityDetailPage),  canActivate: [authGuard] },
  { path: 'events',          loadComponent: () => import('./pages/events/events.page').then(m => m.EventsPage),               canActivate: [authGuard] },
  { path: 'events/:id',      loadComponent: () => import('./pages/event-detail/event-detail.page').then(m => m.EventDetailPage), canActivate: [authGuard] },
  { path: 'hotels',          loadComponent: () => import('./pages/hotels/hotels.page').then(m => m.HotelsPage),               canActivate: [authGuard] },
  { path: 'restaurants',     loadComponent: () => import('./pages/restaurants/restaurants.page').then(m => m.RestaurantsPage), canActivate: [authGuard] },
  { path: 'ai-guide',        loadComponent: () => import('./pages/ai-guide/ai-guide.page').then(m => m.AiGuidePage),          canActivate: [authGuard] },
  { path: 'search',          loadComponent: () => import('./pages/search/search.page').then(m => m.SearchPage),               canActivate: [authGuard] },
  { path: 'notifications',   loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage), canActivate: [authGuard] },
  { path: 'settings',        loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),         canActivate: [authGuard] },
  { path: 'about',           loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage),                  canActivate: [authGuard] },
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
];
