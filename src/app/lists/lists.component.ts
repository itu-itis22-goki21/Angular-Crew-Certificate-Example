import { ViewChild, AfterViewInit, Component, OnInit,  inject, Input } from '@angular/core';
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
import { NewCertificateTypeComponent } from "./new-certificate-type/new-certificate-type.component";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { MatInput } from '@angular/material/input';


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
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    
    MatInput
]
})
export class ListsComponent implements AfterViewInit, OnInit {
    private _liveAnnouncer = inject(LiveAnnouncer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;

  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  memberBeingEdited: Member | null = null;
  
  selectedMember: Member | null = null;
  newCertificateType: CertificateType|null=null;
  isAddingCrew = false;
  certificateTypeBeingEdited: CertificateType | null = null;
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
    const certificates = this.CertificateTypeService.getCertificateTypes(); // mock or actual
    this.certificateDataSource.data = certificates;
  }
  constructor(private route: ActivatedRoute,private dialog: MatDialog, private router: Router,private CertificateTypeService:CertificateTypeService, private listsService: ListsService) {}
  pageType: 'crew' | 'certificateTypes' = 'crew';
  

   ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  isAddingCertificate = false;

  onStartAddCertificate() {
    this.isAddingCertificate = true;
    this.certificateTypeBeingEdited = null;
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
  this.certificateTypeBeingEdited = null;
  this.originalCertName = null;
}



  onCancelAddCertificate() {
    this.isAddingCertificate = false;
  }
onEditCertificateType(cert: CertificateType) {
  this.certificateTypeBeingEdited = { ...cert }; // clone to prevent live mutation
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
      member: member
    },
    width: '800px',
    height: '800px',
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
  if((member.discount??0) < 0){
    member.discount= 0;
  }
  member.totalIncome = this.getDiscountedIncome(member);
  //to make this persistent overwriting new total income
  const i = this.listsService.CREW_DATA.findIndex(m=>m.id === member.id);
  this.listsService.CREW_DATA[i] = {...member};
  
}

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}


