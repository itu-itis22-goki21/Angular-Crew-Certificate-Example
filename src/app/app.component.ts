import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from './sidenav/sidenav.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent,
     SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  selectedLang: 'en' | 'tr' | 'pt' = 'en';
}

