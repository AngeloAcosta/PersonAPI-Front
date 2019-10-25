export class KinshipRelation {
  personId: string;
  relativeId: string;
  kinshipType: string;
}

export class Kinship {
  id?: number;
  namePerson: string;
  lastNamePerson: string;
  kinshipType: string;
  nameRelative: string;
  lastNameRelative: string;
}

export class TryKinship {
  added: Array<string>;
  modified: Array<string>;
  deleted: Array<string>;
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

export class ApiTryKinship {
  status: string;
  data: TryKinship;
  message: string;
}

export class ApiKinship {
  status: string;
  data: Array<KinshipModel>;
  message: Array<string>;
}
