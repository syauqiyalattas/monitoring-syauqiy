import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';
import Login from './pages/login';
import Register from './pages/register';
import Grid from './grid/grid';
import AmCharts from './pages/charts';
import DonutCharts from './pages/donut-charts';
import Map from './pages/maps';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/grid',
    component: Grid,
  },
  {
    path: '/charts',
    component: AmCharts,
  },
  {
    path: '/donut',
    component: DonutCharts,
  },
  {
    path: '/map',
    component: Map
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
