import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CertificateType } from '../../models/certificate-type.model';
import { Certificate } from '../../models/certificate.model';
import { CertificateTypeService } from '../../services/certificate-type.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CertificateService } from '../../services/certificate.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-new-certificate-modal',
  standalone: true,
  templateUrl: './new-certificate-modal.component.html',
  styleUrl: './new-certificate-modal.component.css',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDividerModule,
    TranslateModule,
  ],
})
export class NewCertificateModalComponent {
  name = '';
  issueDate = '';
  expireDate = '';
  selectedTypeName = '';

  certificateTypes: CertificateType[] = [];
  certificates= this.certificateService.CERTIFICATE_DATA;
  constructor(
    private dialogRefer: MatDialogRef<NewCertificateModalComponent>,
    private certificateTypeService: CertificateTypeService,
    private certificateService: CertificateService,
    @Inject(MAT_DIALOG_DATA) public data: { certificateToEdit: Certificate | null }
  ) {
    this.certificateTypes = this.certificateTypeService.getCertificateTypes();
    
    if (this.data.certificateToEdit) {
      this.name = this.data.certificateToEdit.name;
      this.issueDate = this.data.certificateToEdit.issueDate ?? '';
      this.expireDate = this.data.certificateToEdit.expireDate ?? '';
      this.selectedTypeName = this.getTypeName(this.data.certificateToEdit.tId);
      console.log('Editing existing cert:', this.data.certificateToEdit);
    }

  }

  getTypeName(tId: number): string {
    return this.certificateTypes.find(t => t.tId === tId)?.name ?? '';
  }

  onCancel(): void {
    this.dialogRefer.close();
  }

  onSubmit(): void {
    let selectedType = this.certificateTypes.find(t => t.name === this.selectedTypeName);
    console.log(this.selectedTypeName);
    if (!selectedType) {
      console.warn("You fucked up");
      return;
    }
    else{       
      const existingCert = this.certificates.find(c => c.name === this.name);
      if (existingCert) {
        // Reuse existing certificate — don't create a new one
        
        this.dialogRefer.close(existingCert);
      }else{
        const cert: Certificate = {
          id: this.data.certificateToEdit?.id ?? Date.now(),
          name: this.name,
          issueDate: this.issueDate,
          expireDate: this.expireDate,
          tId: selectedType.tId,
          type: selectedType
        };
        console.log(this.data.certificateToEdit);
        const existingIndex = this.certificates.findIndex(c => c.id === cert.id);
        if (existingIndex !== -1) {
          this.certificates[existingIndex] = cert; // Update the data source
        } else {
          this.certificates.push(cert); // Add new
        }
        this.dialogRefer.close(cert);
      }
    }
    

    
  }
}
