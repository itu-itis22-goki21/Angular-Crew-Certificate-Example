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
  
  constructor(private translate: TranslateService,
              public listsService: ListsService,
              public certificateService: CertificateService,
              public certificateTypeService: CertificateTypeService,
              private router: Router
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
    console.log(this.searchControl);
    const element = this.checkService(this.searchControl);

    if (element) {
      this.listsService.loadAllMembers(element);
      this.isSearched = true;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/crew']);
      });
    }
  }
  goBack() {
    this.searchControl = '';
    this.search();
    this.isSearched= false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search(); // Trigger search on Enter key press
    }
  }

  checkService(value: string): Member[]|null {
    const filteredValue = value.toLowerCase();

    const element =  this.listData.filter(e =>
      e.firstName.toLowerCase().includes(filteredValue) ||
      e.lastName.toLowerCase().includes(filteredValue) ||
      e.nationality.toLowerCase().includes(filteredValue)||
      e.title.toLowerCase().includes(filteredValue)
    );
    if(element.length>0){
      console.log("matched elements :", element);
      return element;
    }
    const certMatch = this.certificateData.filter(e=>e.name.toLowerCase().includes(value.toLowerCase()))
    if(certMatch){
      
    }
    
    return null;
    
  }
}
