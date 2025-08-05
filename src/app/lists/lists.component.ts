import { ViewChild, AfterViewInit, Component, OnInit,  inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';


import { Member } from './models/lists.model';
import { TranslateModule } from '@ngx-translate/core';
import { NewCrewComponent } from "./new-crew/new-crew.component";
import { ListsService } from './lists.service';
import { CertificateTypeService } from './certificate-type.service';
import { Certificate } from './models/certificate.model';
import { CertificateType } from './models/certificate-type.model';
import { CertificateModalComponent } from '../modals/certificate-modal/certificate-modal.component';
import { NewCertificateTypeComponent } from "./new-certificate-type/new-certificate-type.component";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CertificateListComponent } from './certificate-list/certificate-list.component';


@Component({
  selector: 'app-lists',
  standalone: true,
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatSortModule,
    NewCrewComponent,
    CommonModule,
    NewCertificateTypeComponent,
    TranslateModule,
    FormsModule,
    MatFormFieldModule
]
})
export class ListsComponent implements AfterViewInit, OnInit {
    private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;


  memberBeingEdited: Member | null = null;
  
  selectedMember: Member | null = null;
  newCertificateType: CertificateType|null=null;
  isAddingCrew = false;
  certificateBeingEdited: CertificateType | null = null;
  originalCertName: string | null = null;



  dataSource = new MatTableDataSource<Member>();
  certificateDataSource = new MatTableDataSource<CertificateType>();
  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path;
    this.pageType = path?.includes('certificateTypes') ? 'certificateTypes' : 'crew';
  
    if (this.pageType === 'crew') {
      this.loadMembers();
    } else {
      this.loadCertificates(); 
    }
  }

  loadCertificates() {
    const certificates = this.CertificateTypeService.getCertificates(); // mock or actual
    this.certificateDataSource.data = certificates;
  }
  constructor(private route: ActivatedRoute,private dialog: MatDialog, private router: Router,private CertificateTypeService:CertificateTypeService, private listsService: ListsService) {}
  pageType: 'crew' | 'certificateTypes' = 'crew';
  

   ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.certificateDataSource.paginator = this.paginator;
  }
  isAddingCertificate = false;

  onStartAddCertificate() {
    this.isAddingCertificate = true;
    this.certificateBeingEdited = null;
  }
  onAddCertificate(newCert: CertificateType) {
  console.log('Edited cert:', newCert);
  console.log('Original name:', this.originalCertName);    
  const index = this.CertificateTypeService.CERTIFICATE_DATA.findIndex(
    c => c.name === this.originalCertName
  );

  if (index !== -1) {
    // Edit existing certificate
    this.CertificateTypeService.CERTIFICATE_DATA[index] = newCert;
  } else {
    // Add new certificate
    this.CertificateTypeService.CERTIFICATE_DATA.push(newCert);
  }

  this.loadCertificates();
  this.isAddingCertificate = false;
  this.certificateBeingEdited = null;
  this.originalCertName = null;
}



  onCancelAddCertificate() {
    this.isAddingCertificate = false;
  }
onEditCertificateType(cert: CertificateType) {
  this.certificateBeingEdited = { ...cert }; // clone to prevent live mutation
  this.originalCertName = cert.name;
  this.isAddingCertificate = true;
  
}

  onDeleteCertificateType(cert: CertificateType) {
    const confirmed = confirm(`Are you sure you want to delete certificate type "${cert.name}"?`);
    if (confirmed) {
      this.CertificateTypeService.CERTIFICATE_DATA = this.CertificateTypeService.CERTIFICATE_DATA.filter(c => c.name !== cert.name);
      this.loadCertificates();
    }
}



  goCardPage(member: Member) {
    this.router.navigate(['/crew-card', member.id]);
  }


  onEditMember(member: Member) {
    this.memberBeingEdited = member;
    this.isAddingCrew = true;
  }
  

loadMembers() {
  const members = this.listsService.getMembers().map(member => ({
    ...member,
    totalIncome: this.listsService.calculateTotalIncome(member),
  }));

  this.dataSource.data = members;
}


   onCancelAddCrew() {
    this.isAddingCrew = false;
  }
  onStartAddCrew(){
    
    this.isAddingCrew = true;
  }
  onAddCrew(crewData: Member) {
    this.listsService.addOrUpdateMember(crewData);
    crewData.totalIncome = this.listsService.calculateTotalIncome(crewData);
    this.loadMembers();
    this.isAddingCrew = false;
    this.memberBeingEdited = null;
  }

  onDeleteMember(member: Member) {
    const confirmed = confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`);
    if (confirmed) {
      this.listsService.deleteMember(member.id);
      this.loadMembers();
    }
  }

  editMember(member: Member | null) {
    if (!member) return;
      console.log('Editing:', member);
  }

openDialog(member: Member) {
  this.dialog.open(CertificateListComponent, {
    data: {
      certificateTypes: member.certificateTypes ?? []
    },
    width: '600px',
    autoFocus: true
  });
}

  onViewCertificateDetails(cert: CertificateType) {
  this.dialog.open(CertificateModalComponent, {
    data: {
      certificateTypes: [cert]
    },
    width: '600px',
    autoFocus: true
  });
}
getTotalIncomeForMember(member: Member): number {
  const dailyRate = member.dailyRate ?? 0;
  const days = parseInt(member.daysOnBoard || '0', 10);
  return dailyRate * days;
}
getTotalIncomeByCurrency(currency: string): number {
  return this.dataSource.filteredData
    .filter(member => member.currency === currency)
    .reduce((sum, member) => {
      const days = Number(member.daysOnBoard) || 0;
      const baseIncome = days * (member.dailyRate || 0);
      const discount = member.discount || 0;
      const netIncome = baseIncome - discount;
      return sum + netIncome;
    }, 0);
}
getDiscountedIncome(member: Member): number {
  const days = Number(member.daysOnBoard) || 0;
  const base = days * member.dailyRate;
  const discount = member.discount || 0;
  return base - discount ;
}

updateTotalIncome(member: Member) {
  member.totalIncome = this.getDiscountedIncome(member);
}

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


