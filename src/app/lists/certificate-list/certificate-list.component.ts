import { AfterViewInit, Component, inject, Inject, Input, Optional, ViewChild,   } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { CertificateService } from '../../services/certificate.service';
import { CertificateType } from '../../models/certificate-type.model';
import { Certificate } from '../../models/certificate.model';
import { CertificateDialogService } from '../certificate-dialog.service';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ListsService } from '../../services/lists.service';
import { Member } from '../../models/lists.model';
import { CertificateTypeService } from '../../services/certificate-type.service';
import {  MatSort, Sort, MatSortModule} from '@angular/material/sort';
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { NewCertificateModalComponent } from '../new-certificate-modal/new-certificate-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [MatTableModule,MatButtonModule,MatMenuModule,TranslateModule, MatPaginatorModule, MatSortModule, MatMenu, MatIcon],
  templateUrl: './certificate-list.component.html',
  styleUrl: './certificate-list.component.css'
})

export class CertificateListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  @Input() member: Member | null = null;//bind data from crew card
  dataSource = new MatTableDataSource<Certificate>();
  constructor(
    private certificateTypeService:CertificateTypeService,
    private dialog:MatDialog,
    private  certificateService: CertificateService,
    private listsService: ListsService,
    //this data member comes from crew list
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { certificateTypes: CertificateType[], member?: Member }    
  ) {}
  allCertificates: Certificate[]= [];
  allCrew: Member[] = this.listsService.CREW_DATA;
  selectedCertificates: Certificate[] = [];
  ngOnInit() {
    //member comes from crew list and member comes from crew card
    const memberOrigin = this.member ?? this.data?.member;

    //console.log("member origin",memberOrigin);
    if(memberOrigin){
      this.allCertificates = this.certificateService.CERTIFICATE_DATA.filter(c=> c.memberId === memberOrigin.id);
      this.dataSource.data = this.allCertificates;
    }
    //this one for magic search
    else if(this.certificateService.filteredCertificates){
      this.dataSource.data = this.certificateService.filteredCertificates;
    }
    else{
      this.allCertificates = this.certificateService.CERTIFICATE_DATA;
      this.dataSource.data = this.allCertificates;
    }

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }


  getType(certificate: Certificate): string{
    return this.certificateTypeService.CERTIFICATE_DATA.find(c=>c.tId === certificate.tId)?.name ?? 'unknown';
  }
  addCertificate(): void {
    
    const dialogRef = this.dialog.open(NewCertificateModalComponent, {
      width: '500px',
      data: {//this line's purpose is edit cert if isnt used no edit
      }
    });

    dialogRef.afterClosed().subscribe((result: Certificate ) => {
    if (result) {
      console.log(result);
      if (this.data && this.data.member) {
        result.memberId = this.data.member.id; 
      }
      // Refresh local certificates from the service to include the new one
      const memberOrigin = this.member ?? this.data?.member;
      if (memberOrigin) {
        this.allCertificates = this.certificateService.CERTIFICATE_DATA.filter(c => c.memberId === memberOrigin.id);
      } else {
        this.allCertificates = this.certificateService.CERTIFICATE_DATA;
      }

      // Update data source for the table
      this.dataSource.data = [...this.allCertificates];
      // Optional: console check
      console.log('Updated member certs:', result.name, result.memberId,  this.data.member?.id);
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
        //check here again later
        const index = this.allCertificates.findIndex(c => c.id === cert.id);
        if (index !== -1) {
          this.allCertificates[index] = result;
        }
        //check here again later
        const globalIndex = this.certificateService.CERTIFICATE_DATA.findIndex(c => c.id === cert.id);
        if (globalIndex !== -1) {
          this.certificateService.CERTIFICATE_DATA[globalIndex] = result;
        }
        //check here again later
        /*this.allCrew.forEach(member => {
        if (member.certificates) {
          const certIndex = member.certificates.findIndex(c => c.id === cert.id);
          if (certIndex !== -1) {
            member.certificates[certIndex] = result;
          }
        }
      });
      */
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
    /*this.allCrew.forEach(member => {
      if (member.certificates) { 
        member.certificates = member.certificates.filter(
          (c) => c.id !== certificate.id
        );
      }
    });
    */
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

