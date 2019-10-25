export class ContactType {
  id: number;
  name: string;
}

export class Country {
  id: number;
  name: string;
}

export class DocumentType {
  id: number;
  name: string;
}

export class Gender {
  id: number;
  name: string;
}

export class Person {
  id: number;
  name: string;
  lastName: string;
  birthdate: string;
  documentTypeId: number;
  documentType: string;
  document: string;
  genderId: number;
  countryId: number;
  country: string;
  contactType1Id?: number;
  contactType1?: string;
  contact1?: string;
  contactType2Id?: number;
  contactType2?: string;
  contact2?: string;
}

export class InspectModel {
  contactTypes: ContactType[];
  countries: Country[];
  documentTypes: DocumentType[];
  genders: Gender[];
  person: Person;
}
