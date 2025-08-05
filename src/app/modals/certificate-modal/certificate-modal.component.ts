import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogTitle } from '@angular/material/dialog';
import { CertificateType } from '../../lists/models/certificate-type.model';
import { Certificate } from '../../lists/models/certificate.model';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import {  MatButtonModule } from '@angular/material/button';
import { NewCertificateModalComponent } from '../../lists/new-certificate-modal/new-certificate-modal.component'; // adjust path
import { CertificateTypeService } from '../../lists/certificate-type.service';
import { CertificateDialogService } from '../../lists/certificate-dialog.service';


@Component({
  selector: 'app-certificate-modal',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './certificate-modal.component.html',
  styleUrl: './certificate-modal.component.css'
})
export class CertificateModalComponent {
  @Input() dataSource: CertificateType[] = [];
  constructor(private certificateDialogService: CertificateDialogService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[] } | null,
    private dialog: MatDialog, private certificateTypeService: CertificateTypeService,
  ) {
    if (data?.certificateTypes) {
      this.dataSource = data.certificateTypes;
    }
  }

  childrenAccessor = (node: CertificateType | Certificate) =>
    'certificates' in node ? node.certificates ?? [] : [];

  hasChild = (_: number, node: CertificateType | Certificate): boolean =>
    'certificates' in node && !!node.certificates?.length;
  addCertificate() {
    this.certificateDialogService.openCertificateDialog().then((newCert: Certificate | null) => {
      if (newCert) {
        // 1. Find the CertificateType with matching tId
        const type = this.dataSource.find(t => t.tId === newCert.tId);

        // 2. If found, push into its certificates array
        if (type) {
          type.certificates.push(newCert);
        } else {
          // 3. If not found, create a new type
          const newType: CertificateType = {
            tId: newCert.tId,
            name: 'Unknown Type', // Optional: replace with a real type name if needed
            description: '',
            certificates: [newCert]
          };
          this.dataSource.push(newType);
        }

        // 4. Trigger UI update by replacing the array (if needed)
        this.dataSource = [...this.dataSource];

      }
    });
  }

  deleteCertificateType(type: CertificateType) {
    this.dataSource = this.dataSource.filter(t => t !== type);
  }

  deleteCertificate(certToDelete: Certificate) {
    for (const type of this.dataSource) {
      if (type.certificates) {
        const initialLength = type.certificates.length;
        type.certificates = type.certificates.filter(cert => cert !== certToDelete);
        if (type.certificates.length !== initialLength) break;
      }
    }

    // Trigger UI update
    this.dataSource = [...this.dataSource];
  }
}
