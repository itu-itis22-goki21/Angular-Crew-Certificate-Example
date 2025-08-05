import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlagPipe } from '../pipes/flag.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FlagPipe, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLang: 'tr' | 'en' | 'pt' = 'en';
  @Output() changedLang = new EventEmitter<'en' | 'tr' | 'pt'>();

  
  onChange(event: Event){
    const lang = (event.target as HTMLSelectElement).value as 'tr' | 'en' | 'pt';
    this.selectedLang = lang;
    this.changedLang.emit(lang);
  }
}
