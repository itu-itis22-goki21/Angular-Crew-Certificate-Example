import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CertificateType } from '../models/certificate-type.model';
import { Certificate } from '../models/certificate.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CertificateTypeService } from '../certificate-type.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  templateUrl: './new-certificate-modal.component.html',
  styleUrl: './new-certificate-modal.component.css',
  imports: [FormsModule, MatFormFieldModule,TranslatePipe, MatInputModule,MatDividerModule, MatButtonModule, MatFormFieldModule, MatOptionModule,MatSelectModule, CommonModule]
})
export class NewCertificateModalComponent {
  name = '';
  issueDate = '';
  expireDate = '';
  selectedCertificateTypeName: string = '';
  selectedCertificateName: string = '';

  certificateTypeOptions: CertificateType[] = [];
  filteredCertificates: Certificate[] = [];
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  constructor(
    private dialogRef: MatDialogRef<NewCertificateModalComponent>,
    private certificateTypeService: CertificateTypeService,
    @Inject(MAT_DIALOG_DATA) public existingCert: Certificate | null
  ) {
    this.certificateTypeOptions = this.certificateTypeService.getCertificates();

    if (this.existingCert) {
      this.name = this.existingCert.name;
      this.issueDate = this.existingCert.issueDate ?? '';
      this.expireDate = this.existingCert.expireDate ?? '';
      this.selectedCertificateTypeName = this.getTypeName(this.existingCert.tId);
      this.filteredCertificates = this.getFilteredCertificates(this.selectedCertificateTypeName);
      this.selectedCertificateName = this.existingCert.name;
    }
  }

  getTypeName(tId: number): string {
    const type = this.certificateTypeOptions.find(t => t.tId === tId);
    return type?.name ?? '';
  }

  getFilteredCertificates(typeName: string): Certificate[] {
    const type = this.certificateTypeOptions.find(t => t.name === typeName);
    return type?.certificates ?? [];
  }

  onCertificateTypeChange() {
    this.filteredCertificates = this.getFilteredCertificates(this.selectedCertificateTypeName);
    this.selectedCertificateName = '';
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCertificateSelect() {
    if (this.selectedCertificateName === '__custom__') {
      this.name = '';
    } else {
      this.name = this.selectedCertificateName;
    }
  }

  onSubmit() {
    let selectedType = this.certificateTypeOptions.find(
      type => type.name === this.selectedCertificateTypeName
    );
   

    if (!selectedType) {
      const newTId = Date.now(); 
      
      selectedType = {
        tId: newTId,
        name: this.selectedCertificateTypeName,
        description: '',
        certificates: []
      };

      this.certificateTypeOptions.push(selectedType);
    }
    
    this.dialogRef.close({
       
      id: this.existingCert?.id ?? Date.now(),  // preserve ID if editing
      name: this.name,
      issueDate: this.issueDate,
      expireDate: this.expireDate,
      tId: selectedType.tId
    });
  }
}
