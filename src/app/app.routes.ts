import {  Routes } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { CrewCardComponent } from './lists/crew-card/crew-card.component';
import { CertificateListComponent } from './lists/certificate-list/certificate-list.component';


export const routes: Routes = [
  { path: 'crew', component: ListsComponent },
  { path: 'certificateTypes', component: ListsComponent },
  { path: 'certificates', component: CertificateListComponent },
  { path: '', redirectTo: 'crew', pathMatch: 'full' },
  { path: 'crew-card/:id', component: CrewCardComponent }
];