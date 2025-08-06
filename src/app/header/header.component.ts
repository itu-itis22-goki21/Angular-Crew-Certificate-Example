import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLang: 'tr' | 'en' | 'pt' = 'en';
  @Output() changedLang = new EventEmitter<'en' | 'tr' | 'pt'>();

  constructor(private translate: TranslateService) {}

  onChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as 'en' | 'tr' | 'pt';
    this.selectedLang = lang;
    this.translate.use(lang); // change language in translate service
    this.changedLang.emit(lang);
  }
}
