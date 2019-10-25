export class ResponseModel<T> {
  status: string;
  message: string;
  data: T;
}
