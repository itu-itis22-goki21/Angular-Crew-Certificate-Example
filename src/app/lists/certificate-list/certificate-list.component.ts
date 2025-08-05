import { AfterViewInit, Component, inject, Inject, Optional, ViewChild,   } from '@angular/core';
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

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [MatTableModule,MatMenuModule, MatPaginatorModule, MatButtonModule, MatSortModule, MatMenu, MatIcon],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css'
})

export class CertificateListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  dataSource = new MatTableDataSource<Certificate>();
  certificateTypes: CertificateType[] = [];
  constructor(
    private certificateDialogService: CertificateDialogService,
    private certificateTypeService: CertificateTypeService,
    private listsService: ListsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[] }
  ) {}

ngOnInit() {
  if (this.data?.certificateTypes) {
    this.certificateTypes = this.data.certificateTypes; // ✅ assign here
    this.dataSource.data = this.certificateTypes.flatMap(
      ct => ct.certificates ?? []
    );
  } else {
    // fallback: show all certificates
    const members = this.listsService.getMembers();
    const allCertificates = this.getAllCertificatesFromAllMembers(members);
    this.dataSource.data = allCertificates;
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
}



announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}

