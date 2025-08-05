import { Component, EventEmitter,Input,OnChanges,Output, SimpleChanges } from '@angular/core';
import { CertificateType } from '../models/certificate-type.model';
import { CertificateService } from '../certificate.service';
import { Certificate } from '../models/certificate.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CertificateTypeService } from '../certificate-type.service';

@Component({
  selector: 'app-new-certificate-type',
  standalone: true,
  imports: [FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatMenuModule,
        MatButtonModule,
        
  ],
  templateUrl: './new-certificate-type.component.html',
  styleUrl: './new-certificate-type.component.css'
})
export class NewCertificateTypeComponent implements OnChanges{
  constructor(private certificateService:CertificateService, private certificateTypeService: CertificateTypeService){}
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
  ngOnChanges(changes: SimpleChanges) {
      if (changes['certificateToEdit'] && this.certificateToEdit) {
        const m = this.certificateToEdit;
        this.enteredName = m.name;
        this.enteredDescription = m.description;
      }
    }
  onSubmit() {
    const cert: CertificateType = {
      tId: this.certificateTypeService.getLastId(),
      name: this.enteredName,
      description: this.enteredDescription,
      certificates: this.certificateToEdit?.certificates ?? []
    };

    console.log('SUBMITTED:', cert);
    this.Add.emit(cert);
  }
}

