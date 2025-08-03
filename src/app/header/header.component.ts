import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlagPipe } from '../pipes/flag.pipe';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FlagPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLang = 'en';
  @Output () changedLang = new EventEmitter<string>();
  
  onChange(event: Event){
    const lang = (event.target as HTMLSelectElement).value;
    this.selectedLang = lang;
    this.changedLang.emit(lang);
  }
}
