import { AfterViewInit, Component, inject, Inject, Input, Optional, ViewChild,   } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CertificateService } from '../certificate.service';
import { CertificateType } from '../models/certificate-type.model';
import { Certificate } from '../models/certificate.model';
import { CertificateDialogService } from '../certificate-dialog.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ListsService } from '../lists.service';
import { Member } from '../models/lists.model';
import { CertificateTypeService } from '../certificate-type.service';
import {  MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NewCertificateModalComponent } from '../new-certificate-modal/new-certificate-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [MatTableModule,MatButtonModule,MatMenuModule,TranslateModule, MatPaginatorModule, MatSortModule, MatMenu, MatIcon],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css'
})

export class CertificateListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() member: Member | null = null;//bind data from crew card
  dataSource = new MatTableDataSource<Certificate>();
  constructor(
    private dialog:MatDialog,
    private  certificateService: CertificateService,
    private listsService: ListsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[], member?: Member }    
  ) {}
  allCertificates: Certificate[]= [];
  allCrew: Member[] = this.listsService.CREW_DATA;
  selectedCertificates: Certificate[] = [];
  ngOnInit() {
    const memberOrigin = this.member ?? this.data?.member;
    if (memberOrigin?.certificates) {
      this.allCertificates = [...memberOrigin.certificates];
    } else {
      this.allCertificates = [...this.certificateService.CERTIFICATE_DATA];
    }
    this.dataSource.data = [...this.allCertificates];

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }


  getType(certificate: Certificate): string{
    return certificate.type?.name ?? 'Unkonwn';
  }
  addCertificate(): void {
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
      width: '500px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe((result: Certificate | undefined) => {
    if (result) {
      // Add to local data
      this.allCertificates.push(result);
      this.dataSource.data = [...this.allCertificates];

      if (this.data.member) {
        if (!this.data.member.certificates) {
          this.data.member.certificates = [];
        }
        this.data.member.certificates.push(result);
      }

      // Optional: console check
      console.log('Updated member certs:', this.data.member?.certificates);
    }
  });

  }

  editCertificate(cert: Certificate): void {
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
      width: '500px',
      data: {
        certificateToEdit: cert
      }
    });

    dialogRef.afterClosed().subscribe((result: Certificate ) => {
      if (result) {
        const index = this.allCertificates.findIndex(c => c.id === cert.id);
        if (index !== -1) {
          this.allCertificates[index] = result;
        }
        const globalIndex = this.certificateService.CERTIFICATE_DATA.findIndex(c => c.id === cert.id);
        if (globalIndex !== -1) {
          this.certificateService.CERTIFICATE_DATA[globalIndex] = result;
        }
        this.allCrew.forEach(member => {
        if (member.certificates) {
          const certIndex = member.certificates.findIndex(c => c.id === cert.id);
          if (certIndex !== -1) {
            member.certificates[certIndex] = result;
          }
        }
      });
      this.dataSource.data = [...this.allCertificates];
      }
      
    });
  }
  deleteCertificate(certificate: Certificate): void{
    this.allCertificates = this.allCertificates.filter(c=> c.id !== certificate.id);
    //remove from global certificates
    this.certificateService.CERTIFICATE_DATA = this.certificateService.CERTIFICATE_DATA.filter(
      c => c.id !== certificate.id//in order to remove permanently
    );
    //remove certificate from the member's certificates perm 
    this.allCrew.forEach(member => {
      if (member.certificates) { 
        member.certificates = member.certificates.filter(
          (c) => c.id !== certificate.id
        );
      }
    });
    this.dataSource.data = [...this.allCertificates];
  }


announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}

