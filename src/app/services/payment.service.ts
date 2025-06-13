import { Injectable } from '@angular/core';
import { HttpWrapperService } from './api-service.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpWrapperService) {}

  createOrder(amount: number): Observable<any> {
    return this.http.post('payment/create-order', { amount });
  }

  verifyPayment(data: any): Observable<any> {
    return this.http.post('payment/verify-payment', data);
  }
}
