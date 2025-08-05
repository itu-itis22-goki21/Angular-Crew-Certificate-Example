import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
    private currentLang: 'en' | 'tr' | 'pt' = 'en'; // default language
  
  private dictionary: Record<string, { en: string; tr: string; pt: string }> = {
    'Crew Management System': {en:'Crew Management System', tr:'Tayfa Yönetim Sistemi', pt:'Bilmiyorum'},
    'First Name':     { en: 'First Name',     tr: 'Ad',              pt: 'Nome' },
    'Last Name':      { en: 'Last Name',      tr: 'Soyad',           pt: 'Sobrenome' },
    'Nationality':    { en: 'Nationality',    tr: 'Uyruk',           pt: 'Nacionalidade' },
    'Title':          { en: 'Title',          tr: 'Unvan',           pt: 'Título' },
    'Days On Board':  { en: 'Days On Board',  tr: 'Gemide Gün',      pt: 'Dias a Bordo' },
    'Daily Rate':     { en: 'Daily Rate',     tr: 'Günlük Ücret',    pt: 'Taxa Diária' },
    'Currency':       { en: 'Currency',       tr: 'Para Birimi',     pt: 'Moeda' },
    'Captain':        { en: 'Captain',        tr: 'Kaptan',          pt: 'Capitão' },
    'Traveller':      { en: 'Traveller',      tr: 'Yolcu',           pt: 'Viajante' },
    'Machinist':      { en: 'Machinist',      tr: 'Makineci',        pt: 'Maquinista' },
    'Add Certificate':{ en: 'Add Certificate',tr: 'Sertifika Ekle',  pt: 'Adicionar Certificado' },
    'Cancel':         { en: 'Cancel',         tr: 'İptal',           pt: 'Cancelar' },
    'Create':         { en: 'Create',         tr: 'Oluştur',         pt: 'Criar' },
    'Certificate Type':{en: 'Certificate Type',tr: 'Sertifika Türü', pt: 'Tipo de Certificado' },
    'Certificate':    { en: 'Certificate',    tr: 'Sertifika',       pt: 'Certificado' },
    'Issue Date':     { en: 'Issue Date',     tr: 'Veriliş Tarihi',  pt: 'Data de Emissão' },
    'Expire Date':    { en: 'Expire Date',    tr: 'Son Geçerlilik',  pt: 'Data de Expiração' },
    'Edit':           { en: 'Edit',           tr: 'Düzenle',         pt: 'Editar' },
    'Delete':         { en: 'Delete',         tr: 'Sil',             pt: 'Excluir' },
    'Unknown Type':   { en: 'Unknown Type',   tr: 'Bilinmeyen Tür',  pt: 'Tipo Desconhecido' },
    'Navigation':   { en: 'Navigation',   tr: 'Araçlar',  pt: 'Navigatione' },
    'Crew List':   { en: 'Crew List',   tr: 'Tayfa Listesi',  pt: 'Crew Liste' },
    'Certificate Types':{en: 'Certificate Types',tr: 'Sertifika Türleri', pt: 'Tipo de Certificado' },
    'Certificates':    { en: 'Certificates',    tr: 'Sertifikalar',       pt: 'Certificado' },
      'Actions': { en: 'Actions', tr: 'İşlemler', pt: 'Ações' },
    'Owner': { en: 'Owner', tr: 'Sahibi', pt: 'Proprietário' },
    'Paginator': { en: 'Paginator', tr: 'Sayfalayıcı', pt: 'Paginador' }
  };

    transform(value: string, lang?: 'en' | 'tr' | 'pt'): string {
        const activeLang = lang ?? this.currentLang;
        return this.dictionary[value]?.[activeLang] ?? value;
    }

    // Optional: Call this to switch languages dynamically
    setLanguage(lang: 'en' | 'tr' | 'pt') {
        this.currentLang = lang;
    }
}
