import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from './sidenav/sidenav.component';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./login/login.component";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent,
    SidenavComponent,
    CommonModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  authenticated:boolean = false;
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'tr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang()?? 'en';
    translate.use(browserLang.match(/en|tr|pt/) ? browserLang : 'en');
  }

  onLoginStatusChange(authenticated:boolean){
    this.authenticated = authenticated;
  }
}

