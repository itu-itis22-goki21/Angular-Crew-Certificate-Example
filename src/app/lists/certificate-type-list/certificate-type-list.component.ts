import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NewCertificateTypeComponent } from '../new-certificate-type/new-certificate-type.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CertificateType } from '../../models/certificate-type.model';
import { CertificateTypeService } from '../../services/certificate-type.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-certificate-type-list',
  standalone: true,
  imports: [CommonModule,
            MatIconModule,
            MatMenuModule,
            NewCertificateTypeComponent,
            MatPaginatorModule,
            MatTableModule,
            MatButtonModule,
            TranslateModule,
            MatSortModule,
          ],
  templateUrl: './certificate-type-list.component.html',
  styleUrl: './certificate-type-list.component.css'
})
export class CertificateTypeListComponent implements OnInit {
  constructor(private certificateTypeService: CertificateTypeService){}
  certificateTypeBeingEdited: CertificateType | null = null;
  originalCertName: string | null = null;
  isAddingCertificate = false;
  certificateDataSource = new MatTableDataSource<CertificateType>();
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  ngOnInit() {
    if(this.certificateTypeService.filteredCertTypes){
      this.certificateDataSource.data = this.certificateTypeService.filteredCertTypes;
    }else{
      this.certificateDataSource.data =this.certificateTypeService.getCertificateTypes();
    }
  }
  ngAfterViewInit(): void {
    this.certificateDataSource.sort = this.sort;
    this.certificateDataSource.paginator = this.paginator;
  }
  onStartAddCertificate(): void {
    this.isAddingCertificate = true;
    this.certificateTypeBeingEdited = null; 
  }
  onCancelAddCertificate(): void {
    this.isAddingCertificate = false;
    this.certificateTypeBeingEdited = null;
    this.originalCertName = null;
  }
  onAddCertificate(newCert: CertificateType) {
    const existingIndex = this.certificateTypeService.CERTIFICATE_DATA
      .findIndex(c => c.tId === newCert.tId);

    if (existingIndex !== -1) {
      this.certificateTypeService.CERTIFICATE_DATA[existingIndex] = newCert;
    } else {
      this.certificateTypeService.CERTIFICATE_DATA.push(newCert);
    }

    this.loadCertificates();
    this.onCancelAddCertificate();
  }
  onEditCertificateType(cert: CertificateType): void {
    this.certificateTypeBeingEdited = { ...cert }; // avoid direct mutation
    this.originalCertName = cert.name;
    this.isAddingCertificate = true;
  }
  onDeleteCertificateType(cert: CertificateType): void {
    const confirmed = confirm(`Are you sure you want to delete certificate type "${cert.name}"?`);
    if (confirmed) {
      this.certificateTypeService.CERTIFICATE_DATA = this.certificateTypeService.CERTIFICATE_DATA.filter(
        c => c.name !== cert.name
      );
      this.loadCertificates(); // Refresh table
    }
  }
  loadCertificates(): void {
    const certs = this.certificateTypeService.getCertificateTypes(); // or CERTIFICATE_DATA directly
    this.certificateDataSource.data = certs;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
