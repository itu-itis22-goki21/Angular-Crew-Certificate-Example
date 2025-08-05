import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  templateUrl: './new-certificate-modal.component.html',
  styleUrl: './new-certificate-modal.component.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule,MatDividerModule, MatButtonModule, MatFormFieldModule, MatOptionModule,MatSelectModule, CommonModule]
})
export class NewCertificateModalComponent {
  name = '';
  issueDate = '';
  expireDate = '';
  certificateTypeOptions: CertificateType[] = [];
  filteredCertificates: Certificate[] = [];

  selectedCertificateTypeName: string = '';
  selectedCertificateName: string = '';

  selectedCertificates: Certificate[] = [];
  constructor(
    private dialogRef: MatDialogRef<NewCertificateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public parentTypeName: string, private certificateTypeService: CertificateTypeService
  ) {
     this.certificateTypeOptions = this.certificateTypeService.getCertificates();
  }
  onCertificateTypeChange() {
    const selectedType = this.certificateTypeOptions.find(
      type => type.name === this.selectedCertificateTypeName
    );
    
    this.filteredCertificates = selectedType?.certificates ?? [];
    this.selectedCertificateName = '';
  }
  
  onCancel() {
    this.dialogRef.close();
  }
  onCertificateSelect() {
  if (this.selectedCertificateName === '__custom__') {
    // clear the previous name if user wants to enter manually
    this.name = '';
  } else {
    // set the selected name directly
    this.name = this.selectedCertificateName;
  }
}

  onSubmit() {
    const selectedType = this.certificateTypeOptions.find(
      type => type.name === this.selectedCertificateTypeName
    );

    this.dialogRef.close({
      id: new Date().getTime(),
      name: this.name,
      issueDate: this.issueDate,
      expireDate: this.expireDate,
      tId: selectedType?.tId ?? null
    });
  }

}
