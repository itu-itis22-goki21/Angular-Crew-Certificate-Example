import {  Routes } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { CrewCardComponent } from './lists/crew-card/crew-card.component';


export const routes: Routes = [
  { path: 'crew', component: ListsComponent },
  { path: 'certificates', component: ListsComponent },
  { path: '', redirectTo: 'crew', pathMatch: 'full' },
  { path: 'crew-card/:id', component: CrewCardComponent }
];