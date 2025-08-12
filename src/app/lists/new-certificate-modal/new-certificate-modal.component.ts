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
import { Member } from '../../models/lists.model';

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
  certificates = this.certificateService.CERTIFICATE_DATA;

  constructor(
    private dialogRefer: MatDialogRef<NewCertificateModalComponent>,
    private certificateTypeService: CertificateTypeService,
    private certificateService: CertificateService,
    @Inject(MAT_DIALOG_DATA) public data: { certificateToEdit: Certificate | null, member: Member|null }
  ) {
    this.certificateTypes = this.certificateTypeService.getCertificateTypes();
    
    if (this.data.certificateToEdit) {
      this.name = this.data.certificateToEdit.name;
      this.issueDate = this.data.certificateToEdit.issueDate ?? '';
      this.expireDate = this.data.certificateToEdit.expireDate ?? '';
      this.selectedTypeName = this.getTypeName(this.data.certificateToEdit.tId);
    }
  }

  getTypeName(tId: number): string {
    return this.certificateTypes.find(t => t.tId === tId)?.name ?? '';
  }

  onCancel(): void {
    this.dialogRefer.close();
  }

  onSubmit(): void {
    const selectedType = this.certificateTypes.find(t => t.name === this.selectedTypeName);
    if (!selectedType) {
      console.warn("No certificate type found");
      return;
    }
    
    let cert: Certificate;
    if (this.data.certificateToEdit) {
      console.log("cert to edit");
      // Editing an existing certificate
      cert = {
        ...this.data.certificateToEdit,
        name: this.name,
        issueDate: this.issueDate,
        expireDate: this.expireDate,
        tId: selectedType.tId,
        type: selectedType,
      };

      // Find the certificate by id and update it
      const index = this.certificates.findIndex(c => c.id === cert.id);
      if (index !== -1) {
        this.certificates[index] = cert;
      }

    } else {
      console.log("cert to new");
      // Adding a new certificate
      cert = {
        id: Date.now(),
        name: this.name,
        issueDate: this.issueDate,
        expireDate: this.expireDate,
        tId: selectedType.tId,
        type: selectedType,
      };
      
      this.certificateService.CERTIFICATE_DATA.push(cert);
    }

    // Close the dialog uodate or add etc.
    this.dialogRefer.close(cert);
  }
}
