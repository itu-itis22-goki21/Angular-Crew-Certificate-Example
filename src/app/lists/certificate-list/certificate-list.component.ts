import { AfterViewInit, Component, inject, Inject, Input, Optional, ViewChild,   } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CertificateService } from '../certificate.service';
import { CertificateType } from '../models/certificate-type.model';
import { Certificate } from '../models/certificate.model';
import { CertificateModalComponent } from '../../modals/certificate-modal/certificate-modal.component';
import { CertificateDialogService } from '../certificate-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListsService } from '../lists.service';
import { Member } from '../models/lists.model';
import { CertificateTypeService } from '../certificate-type.service';
import {  MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [MatTableModule,MatMenuModule,TranslatePipe, MatPaginatorModule, MatButtonModule, MatSortModule, MatMenu, MatIcon],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css'
})

export class CertificateListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  dataSource = new MatTableDataSource<Certificate>();
  certificateTypes: CertificateType[] = [];
  constructor(
    private certificateDialogService: CertificateDialogService,
    private certificateTypeService: CertificateTypeService,
    private listsService: ListsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[], member?: Member }    
  ) {}

ngOnInit() {
  if (this.data?.member) {
    this.certificateTypes = this.data.member.certificateTypes ?? [];

    // Attach owner to each certificate
    const fullName = `${this.data.member.firstName} ${this.data.member.lastName}`;
    const certificatesWithOwner = this.certificateTypes.flatMap(type =>
      (type.certificates ?? []).map(cert => ({
        ...cert,
        owner: fullName
      }))
    );

    this.dataSource.data = certificatesWithOwner;
  } else {
    this.certificateTypes = this.certificateTypeService.getCertificates();
    this.dataSource.data = this.certificateTypes.flatMap(ct => ct.certificates ?? []);
  }
}


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllCertificatesFromAllMembers(members: Member[]): (Certificate & { owner: string })[] {
    return members.flatMap(member =>
      (member.certificateTypes ?? []).flatMap(type =>
        (type.certificates ?? []).map(cert => ({
          ...cert,
          owner: `${member.firstName} ${member.lastName}`
        }))
      )
    );
  }

getType(certificate: Certificate): string {
  const type = this.data?.certificateTypes?.find(t => t.tId === certificate.tId)
    ?? this.certificateTypeService.getCertificates().find(t => t.tId === certificate.tId);
  return type?.name ?? 'Unknown Type';
}


addCertificate() {
  this.certificateDialogService.openCertificateDialog().then((newCert: Certificate | null) => {
    if (!newCert) return;

    // Make sure certificateTypes is set (if undefined)
    if (!this.certificateTypes) {
      this.certificateTypes = [];
    }

    // Find or create the type
    let type = this.certificateTypes.find(t => t.tId === newCert.tId);

    if (!type) {
      type = {
        tId: newCert.tId,
        name: this.getType(newCert),
        description: '',
        certificates: []
      };
      this.certificateTypes.push(type);
    }

    // Push new certificate
    type.certificates = [...(type.certificates ?? []), newCert];

  this.dataSource.data = [...this.dataSource.data, newCert];
  });
  this.certificateTypeService.setCertificates(this.certificateTypes);
}

editCertificate(cert: Certificate) {
  this.certificateDialogService.openCertificateDialog(cert).then((updatedCert: Certificate | null) => {
    if (!updatedCert) return;
    // Find the certificate type where this certificate belongs
    const type = this.certificateTypes.find(t => t.tId === updatedCert.tId);
    if (!type) {
      console.warn('Certificate type not found for tId:', updatedCert.tId);
      return;
    }

    // Find index of the original certificate
    const certIndex = type.certificates.findIndex(c => c.id === updatedCert.id);
    if (certIndex === -1) return;

    // Replace the certificate at that index
    type.certificates[certIndex] = updatedCert;

    // Update the table without flatMap
    const updatedData: Certificate[] = [];
    for (const t of this.certificateTypes) {
      if (t.certificates) {
        for (const c of t.certificates) {
          updatedData.push(c);
        }
      }
    }
    
    this.dataSource.data = updatedData;
  });
  this.certificateTypeService.setCertificates(this.certificateTypes);
}


deleteCertificate(cert: Certificate) {
  // Remove from certificateTypes (optional but keeps data in sync)
  const type = this.certificateTypes.find(t => t.tId === cert.tId);
  if (type?.certificates) {
    type.certificates = type.certificates.filter(c => c.id !== cert.id);
  }

  // Directly filter out from the table's dataSource
  this.dataSource.data = this.dataSource.data.filter(c => c.id !== cert.id);
  this.certificateTypeService.setCertificates(this.certificateTypes);
}


announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}

