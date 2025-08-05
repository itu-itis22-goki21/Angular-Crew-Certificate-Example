// certificate-dialog.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCertificateModalComponent } from './new-certificate-modal/new-certificate-modal.component';
import { CertificateType } from './models/certificate-type.model';
import { CertificateTypeService } from './certificate-type.service';
import { Certificate } from './models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateDialogService {
  constructor(
    private dialog: MatDialog,
    private certificateTypeService: CertificateTypeService
  ) {}

  async openCertificateDialog(): Promise<Certificate | null> {
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
        width: '400px'
    });

    const newCertificate = await dialogRef.afterClosed().toPromise();

    return newCertificate ?? null; // just return the Certificate object
    }
}
