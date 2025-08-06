import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from './sidenav/sidenav.component';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent,
     SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'tr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang()?? 'en';
    translate.use(browserLang.match(/en|tr|pt/) ? browserLang : 'en');
  }
}

