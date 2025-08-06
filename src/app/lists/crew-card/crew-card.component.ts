import { Component, Input } from '@angular/core';
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
import { MatLineModule } from '@angular/material/core';
import { MatList, MatListItem } from "@angular/material/list";
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CertificateListComponent } from "../certificate-list/certificate-list.component";


@Component({
  selector: 'app-crew-card',
  standalone: true,
  imports: [MatTabsModule, MatLineModule, TranslatePipe, MatTreeModule, MatIconModule, MatButtonModule, MatList, MatListItem, CertificateListComponent],
  templateUrl: './crew-card.component.html',
  styleUrl: './crew-card.component.css'
})
export class CrewCardComponent {
  constructor(private route: ActivatedRoute, private listsService: ListsService, private certificateTypeService: CertificateTypeService) {}

  crewDetails:Member|null = null;
  dataSource:CertificateType[]= [];
  name: string|null = null;
  
  @Input() selectedLang: 'en' | 'tr' | 'pt' = 'en'; 
  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Navigated to crew card with ID:', id);
    this.loadMember(id);

  }
loadMember(id: string | null) {
  this.crewDetails = this.listsService.CREW_DATA.find(m => m.id === id) || null;

  if (this.crewDetails) {
    this.crewDetails.totalIncome = this.listsService.calculateTotalIncome(this.crewDetails);
  }
}

}
