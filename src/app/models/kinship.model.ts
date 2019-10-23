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

export class ApiKinships {
  status: string;
  data: Array<Kinship>;
}
