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
  personId: number;
  personName: string;
  personLastName: string;
  relativeId: number;
  relativeName: string;
  relativeLastName: string;
  kinshipTypeId: string;
  kinshipType: string;
}

export class ApiKinship {
  status: string;
  data: Array<KinshipModel>;
  message: Array<string>;
}
