import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TranslatePipe } from "../pipes/translate.pipe";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterModule // we should add in order to route 
    , TranslatePipe],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
constructor(private router: Router) {}
   @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en';  // <-- Add this
}
