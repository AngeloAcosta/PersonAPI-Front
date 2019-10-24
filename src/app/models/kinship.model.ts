import { Person } from './person.model';

export class KinshipRelation {
  idPerson: string;
  idRelative: string;
  kinship: string;
}

export class Kinship {
  id?: number;
  namePerson: string;
  lastNamePerson: string;
  kinshipType: string;
  nameRelative: string;
  lastNameRelative: string;
}

export class KinshipModel {
  idKinship?: number;
  kinshipType: string;
  person: Person;
  relative: Person;
}

export class ApiKinship {
  status: string;
  data: Array<KinshipModel>;
  message: Array<string>;
}
