import { Routes } from '@angular/router';
import { CreatCardComponent } from './component/creat-card.component';

export const routes: Routes = [
     { path: '', redirectTo: 'create-card', pathMatch: 'full' },
  { path: 'create-card', component: CreatCardComponent }
];
