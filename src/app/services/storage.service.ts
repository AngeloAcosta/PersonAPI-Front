import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor() { }

  private storage = {};

  deleteValue(key: string): void {
    try {
      return this.storage[key] = undefined;
    } catch {
    }
  }

  getValue<T>(key: string): T {
    try {
      return this.storage[key];
    } catch {
      return undefined;
    }
  }

  setValue<T>(key: string, value: T): void {
    this.storage[key] = value;
  }
}
