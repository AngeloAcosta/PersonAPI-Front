export class Person {
  id?: number;
  name: string;
  lastName: string;
  birthdate: string;
  documentTypeId: number;
  document: string;
  genderId: number;
  gender: string;
  countryId: number;
  country: string ;
  contactType1Id?: number;
  contactType1?: string ;
  contact1?: string;
  contactType2Id?: number;
  contactType2?: string;
  contact2?: string;
}
export class ApiPeople {
  status: string;
  data: Array<Person>;
}

export class ApiPerson {
  status: string;
  data: Person;
}
