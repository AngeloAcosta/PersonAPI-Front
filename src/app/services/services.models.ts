export class CreateKinship {
  kinshipType: string;
  relativeId: number;
}

export class CreatePerson {
  birthdate: string;
  contact1?: string;
  contactType1Id?: number;
  contact2?: string;
  contactType2Id?: number;
  countryId: number;
  document: string;
  documentTypeId: number;
  genderId: number;
  lastName: string;
  name: string;
}

export class ModifyKinship {
  kinshipType: string;
}

export class ModifyPerson {
  birthdate: string;
  contact1?: string;
  contactType1Id?: number;
  contact2?: string;
  contactType2Id?: number;
  countryId: number;
  document: string;
  documentTypeId: number;
  lastName: string;
  name: string;
}

export enum OrderBy {
  Name = 1,
  Document,
  DocumentType,
  Country
}

export enum OrderType {
  ASC = 1,
  DESC
}

export class PersonTree {
  owner: TreeOwner;
  levels: PersonTreeNode[][];
}

export class PersonTreeNode {
  relative: TreeLevelRelative;
  kinshipType: SimpleKinshipType;
}

/**
 * Base class for a service response.
 */
export class ServiceResponse<T> {
  /**
   * The response data, this may be null.
   */
  data: T;
  /**
   * Extra information send from the service.
   * If the response was an error response, this will contain the error explanation.
   */
  message: string;
  /**
   * True if the response had a 2XX status code, False otherwhise.
   */
  ok: boolean;
  /**
   * Status information, 'OK' when the response was successful, and 'ERROR' otherwise.
   * It's recommended to use the ok property instead of this one.
   */
  status: string;
}

export class SimpleContactType {
  id: number;
  name: string;
}

export class SimpleCountry {
  id: number;
  name: string;
}

export class SimpleDocumentType {
  id: number;
  name: string;
}

export class SimpleGender {
  id: number;
  name: string;
}

export class SimpleKinship {
  kinshipType: string;
  kinshipTypeId: string;
  personId: number;
  personLastName: string;
  personName: string;
  relativeId: number;
  relativeLastName: string;
  relativeName: string;
}

export class SimpleKinshipType {
  id: string;
  name: string;
}

export class SimplePerson {
  birthdate: string;
  contact1?: string;
  contactType1?: string;
  contactType1Id?: number;
  contact2?: string;
  contactType2?: string;
  contactType2Id?: number;
  country: string;
  countryId: number;
  document: string;
  documentType: string;
  documentTypeId: number;
  gender: string;
  genderId: number;
  id: number;
  lastName: string;
  name: string;
}

export class TestKinship {
  added: string[];
  deleted: string[];
  modified: string[];
}

export class TreeLevelRelative {
  id: number;
  name: string;
  lastName: string;
}

export class TreeOwner {
  id: number;
  name: string;
  lastName: string;
}
