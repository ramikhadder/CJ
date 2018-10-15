import {RouterModule, Routes} from '@angular/router';
import {FormComponent} from './form/form.component';
import {AppAuthGuard} from './app.auth.guard';

const APP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AppAuthGuard],
    component: FormComponent,
    pathMatch: 'full'
  }
];

export const Routing = RouterModule.forRoot(APP_ROUTES);
