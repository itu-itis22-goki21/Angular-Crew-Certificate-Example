// search.service.ts
import { Injectable } from '@angular/core';
import { Member } from '../models/lists.model';
import { CertificateType } from '../models/certificate-type.model';
import { ListsService } from './lists.service';
import { CertificateTypeService } from './certificate-type.service';

type SearchResult =
  | { kind: 'members'; data: Member[] }
  | { kind: 'types'; data: CertificateType[] }
  | { kind: 'none' };

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private lists: ListsService,
    private types: CertificateTypeService
  ) {}

  search(q: string): SearchResult {
    const v = q.trim().toLowerCase();
    if (!v) return { kind: 'none' };

    const members = this.lists.CREW_DATA.filter(m =>
      [m.firstName, m.lastName, m.nationality, m.title]
        .some(x => x?.toLowerCase().includes(v))
    );
    console.log(q);
    if (members.length) return { kind: 'members', data: members };

    const types = this.types.CERTIFICATE_DATA.filter(t =>
      t.name.toLowerCase().includes(v)
    );
    if (types.length) return { kind: 'types', data: types };

    return { kind: 'none' };
  }
}
