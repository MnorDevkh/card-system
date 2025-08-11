import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardService {
  constructor() {}

  getCardTemplateData(): Observable<any> {
    // Static sample data
    const sampleData = {
      name: 'John Doe',
      role: 'Teacher',
      idNumber: 'TCH-2025-001',
      issuedDate: '2025-08-10',
      expiryDate: '2026-08-10',
      schoolName: 'Sunrise International School',
      photoUrl: 'assets/sample-photo.jpg'
    };

    return of(sampleData); // Returns an Observable with sample data
  }
}
