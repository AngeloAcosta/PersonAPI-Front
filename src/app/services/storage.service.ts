import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor() { }

  private storage = {};

  getValue<T>(key: string): T {
    return this.storage[key];
  }

  setValue<T>(key: string, value: T) {
    this.storage[key] = value;
  }
}
