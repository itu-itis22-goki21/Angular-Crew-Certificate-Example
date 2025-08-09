import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { MatOption } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ListsService } from '../services/lists.service';
import { CertificateService } from '../services/certificate.service';
import { CertificateTypeService } from '../services/certificate-type.service';
import { FormControl, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute,Router } from '@angular/router';
import { Member } from '../models/lists.model';
import { Certificate } from '../models/certificate.model';
import { MatButtonModule } from '@angular/material/button';
import { SearchService } from '../services/search.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule,MatInputModule,MatButtonModule, MatFormFieldModule, FormsModule, MatIcon,MatAutocompleteModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  selectedLang: 'tr' | 'en' | 'pt' = 'en';
  @Output() changedLang = new EventEmitter<'en' | 'tr' | 'pt'>();
  searchControl:string = '';
  isSearched:boolean = false;
  goBackFrom:string='';
  
  constructor(private translate: TranslateService,
              public listsService: ListsService,
              public certificateService: CertificateService,
              public certificateTypeService: CertificateTypeService,
              private router: Router,
              private routeNow: ActivatedRoute,
              public searchService: SearchService
  ) {}
  listData = this.listsService.CREW_DATA;
  certificateData = this.certificateService.CERTIFICATE_DATA;
  certificateTypeData= this.certificateTypeService.CERTIFICATE_DATA;
  onChange(event: Event) {
    const lang = (event.target as HTMLSelectElement).value as 'en' | 'tr' | 'pt';
    this.selectedLang = lang;
    this.translate.use(lang); // change language in translate service
    this.changedLang.emit(lang);
  }
search() {
  const res = this.searchService.search(this.searchControl);

  switch (res.kind) {
    case 'members':
      this.listsService.loadAllMembers(res.data);
      this.goBackFrom = 'Crew';
      this.isSearched = true;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/crew'])
      );
      break;
    case 'types':
      this.certificateTypeService.getCertificateTypes(res.data);
      this.goBackFrom ='Certificate Types';
      this.isSearched = true;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/certificateTypes'])
      );
      break;
    case 'certificates':
      this.certificateService.getCertificates(res.data);
      this.goBackFrom ='certificates';
      this.isSearched = true;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/certificates'])
      );
      break;
    case 'none':
    default:

      break;
  }
}
  goBack() {
    this.searchControl = '';
    this.search();
    this.isSearched= false;
    this.listsService.filteredCrew = null;
    this.certificateTypeService.filteredCertTypes = null;
    this.certificateService.filteredCertificates = null;
    if(this.goBackFrom==='Crew'){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/crew']));
    }else if( this.goBackFrom ==='Certificate Types'){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/certificateTypes']));
    }else{
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/certificates']));
    }
    
  
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      console.log(this.searchControl);
      this.search(); // Trigger search on Enter key press
    }
  }


}
