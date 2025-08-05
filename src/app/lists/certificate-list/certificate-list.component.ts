import { AfterViewInit, Component, Inject, Optional, ViewChild,   } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CertificateService } from '../certificate.service';
import { CertificateType } from '../models/certificate-type.model';
import { Certificate } from '../models/certificate.model';
import { CertificateModalComponent } from '../../modals/certificate-modal/certificate-modal.component';
import { CertificateDialogService } from '../certificate-dialog.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListsService } from '../lists.service';
import { Member } from '../models/lists.model';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css'
})
export class CertificateListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Certificate>(this.certificateService.CERTIFICATE_DATA)

  constructor(private certificateDialogService: CertificateDialogService,
              private certificateService: CertificateService,
              private listsService: ListsService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[] }){}

  ngOnInit() {
    const members = this.listsService.getMembers(); // get your member data
    const allCertificates = this.getAllCertificatesFromAllMembers(members);
    this.dataSource.data = allCertificates;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getAllCertificatesFromAllMembers(members: Member[]): Certificate[] {
    return members.flatMap(member =>
      (member.certificateTypes ?? []).flatMap(type =>
        (type.certificates ?? []).map(cert => ({
          ...cert,
          owner: member.firstName ?? member.lastName ?? 'Unknown'
        }))
      )
    );
  }



  getType(certificate: Certificate): string {
    // Find the matching certificate type
    const type = this.certificateService.CERTIFICATE_DATA.find(
      (type) => type.tId === certificate.tId
    );

    // Return the name if found, otherwise empty string
    return type ? type.name : '';
  }
  addCertificate() {
    this.certificateDialogService.openCertificateDialog().then((newCert: Certificate | null) => {
      if (newCert) {
        this.dataSource.data = [...this.dataSource.data, newCert];
      }
    });
  }

  
  
}
