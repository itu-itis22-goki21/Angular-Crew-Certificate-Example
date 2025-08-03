import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flag',
  standalone: true // 👈 This is the key
})
export class FlagPipe implements PipeTransform {
  transform(langCode: string): string {
    switch (langCode) {
      case 'en': return 'EN';
      case 'tr': return 'TR';
      case 'pt': return 'PT';
      case 'cp': return "CP";
      default: return '🏳️';
    }
  }
}