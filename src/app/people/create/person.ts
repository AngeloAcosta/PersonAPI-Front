export class Person {
  id?: number;
  name: string;
  lastName: string;
  birthdate: string;
  documentTypeId: number;
  document: string;
  genderId: number;
  countryId: number;
  contactType1Id?: number;
  contact1?: string;
  contactType2Id?: number;
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
