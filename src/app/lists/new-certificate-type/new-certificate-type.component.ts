import { Component, EventEmitter,Input,OnChanges,Output, SimpleChanges } from '@angular/core';
import { CertificateType } from '../../models/certificate-type.model';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CertificateTypeService } from '../../services/certificate-type.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-certificate-type',
  standalone: true,
  imports: [FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatMenuModule,
        MatButtonModule,
        TranslateModule,        
  ],
  templateUrl: './new-certificate-type.component.html',
  styleUrl: './new-certificate-type.component.css'
})
export class NewCertificateTypeComponent implements OnChanges{
  constructor(private certificateService:CertificateService, private certificateTypeService: CertificateTypeService){}
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  @Input() certificateToEdit: CertificateType | null = null;
  @Output() Add= new EventEmitter<CertificateType>();
  @Output() Cancel = new EventEmitter<void>();
  enteredName:string='';
  enteredDescription:string='';

  addCertificate(newCertificate:Certificate){
    this.certificateService.CERTIFICATE_DATA.push(newCertificate);
  }
  onCancel(){
    this.Cancel.emit();
  }
  //runs any input changes
  ngOnChanges(changes: SimpleChanges) {
      if (changes['certificateToEdit'] && this.certificateToEdit) {
        const m = this.certificateToEdit;
        this.enteredName = m.name;
        this.enteredDescription = m.description;
        
      }
    }
    onSubmit() {
      
      const nameArr: CertificateType|any = this.certificateService.CERTIFICATE_DATA.find(m=> m.type.name === this.certificateToEdit?.name)
      
      console.log(nameArr.type.name);
      this.certificateService.CERTIFICATE_DATA.forEach(cert => {
          if (cert.type.name === nameArr.type.name) {
              cert.type.name = this.enteredName;
              
            }
            // this part remains unfinished
            this.certificateService.CERTIFICATE_DATA = [...this.certificateService.CERTIFICATE_DATA];
            console.log(this.certificateService.CERTIFICATE_DATA);
          });
      const cert: CertificateType = {
      tId: this.certificateTypeService.getLastId()+1,
      name: this.enteredName,
      description: this.enteredDescription,
    };

    console.log('SUBMITTED:', cert);
    this.Add.emit(cert);
  }
}

