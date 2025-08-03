import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import { ListsService } from '../lists.service';
import { Member } from '../models/lists.model';

import {MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CertificateTypeService } from '../certificate-type.service';
import { Certificate } from '../models/certificate.model';
import { CertificateType } from '../models/certificate-type.model';
import { CertificateModalComponent } from '../../modals/certificate-modal/certificate-modal.component';


type CertificateTreeNode = CertificateType | Certificate;
@Component({
  selector: 'app-crew-card',
  standalone: true,
  imports: [MatTabsModule, MatTreeModule,MatIconModule, MatButtonModule, CertificateModalComponent],
  templateUrl: './crew-card.component.html',
  styleUrl: './crew-card.component.css'
})
export class CrewCardComponent {
  constructor(private route: ActivatedRoute, private listsService: ListsService, private certificateTypeService: CertificateTypeService) {}

  crewDetails:Member|null = null;
  dataSource:CertificateType[]= [];
  name: string|null = null;
  
  
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Navigated to crew card with ID:', id);
    this.loadMember(id);

  }
  loadMember(id: string | null) {
  // Find the member by ID
    this.crewDetails = this.listsService.CREW_DATA.find(m => m.id === id) || null;

    // Now the member's title to find the matching certificate set
    if (this.crewDetails?.certificateTypes) {
      
       this.dataSource = this.crewDetails.certificateTypes;
        
    } else {
      this.dataSource = [];
    }
  }

  childrenAccessor = (node: CertificateTreeNode) =>
    'certificates' in node ? node.certificates ?? [] : [];

  hasChild = (_: number, node: CertificateTreeNode):boolean =>
    'certificates' in node && !!node.certificates?.length;

  }

