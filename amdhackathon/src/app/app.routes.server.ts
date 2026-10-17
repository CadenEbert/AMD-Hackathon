import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'create-ticket',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'create-team',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'create-category',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
