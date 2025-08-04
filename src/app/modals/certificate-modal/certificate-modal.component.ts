import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogTitle } from '@angular/material/dialog';
import { CertificateType } from '../../lists/models/certificate-type.model';
import { Certificate } from '../../lists/models/certificate.model';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import {  MatButtonModule } from '@angular/material/button';
import { NewCertificateModalComponent } from '../../lists/new-certificate-modal/new-certificate-modal.component'; // adjust path



@Component({
  selector: 'app-certificate-modal',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './certificate-modal.component.html',
  styleUrl: './certificate-modal.component.css'
})
export class CertificateModalComponent {
  @Input() dataSource: CertificateType[] = [];
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[] } | null,
    private dialog: MatDialog
  ) {
    if (data?.certificateTypes) {
      this.dataSource = data.certificateTypes;
    }
  }

  childrenAccessor = (node: CertificateType | Certificate) =>
    'certificates' in node ? node.certificates ?? [] : [];

  hasChild = (_: number, node: CertificateType | Certificate): boolean =>
    'certificates' in node && !!node.certificates?.length;
  addCertificateGeneral() {
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
      width: '400px',
      data: {
        parentTypeName: '',
        certificateTypes: this.dataSource
      }
    });

    dialogRef.afterClosed().subscribe((newCertificate) => {
      if (!newCertificate?.selectedTypeName) return;

      let targetType = this.dataSource.find(type => type.name === newCertificate.selectedTypeName);

      if (!targetType) {
        targetType = {
          name: newCertificate.selectedTypeName,
          description: '',
          certificates: []
        };
        this.dataSource.push(targetType);
      }

      targetType.certificates = targetType.certificates || [];
      targetType.certificates.push({
        id: newCertificate.id ?? new Date().getTime(),
        name: newCertificate.name,
        issueDate: newCertificate.issueDate,
        expireDate: newCertificate.expireDate
      });

      this.dataSource = [...this.dataSource];
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
