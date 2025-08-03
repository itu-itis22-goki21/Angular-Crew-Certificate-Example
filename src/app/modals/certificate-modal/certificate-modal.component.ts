import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { CertificateType } from '../../lists/models/certificate-type.model';
import { Certificate } from '../../lists/models/certificate.model';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import {  MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-certificate-modal',
  standalone: true,
  imports: [MatTreeModule, MatIconModule, MatButtonModule, MatDialogTitle],
  templateUrl: './certificate-modal.component.html',
  styleUrl: './certificate-modal.component.css'
})
export class CertificateModalComponent {
  @Input() dataSource: CertificateType[] = [];
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[] } | null) {
    //*** If opened via dialog, prefer dialog data ***
    if (data?.certificateTypes) {
      this.dataSource = data.certificateTypes;
    }
  }

  childrenAccessor = (node: CertificateType | Certificate) =>
    'certificates' in node ? node.certificates ?? [] : [];

  hasChild = (_: number, node: CertificateType | Certificate): boolean =>
    'certificates' in node && !!node.certificates?.length;
}
