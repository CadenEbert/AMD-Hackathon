import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateTicketService {
    url: string = 'http://localhost:8000';
    private http = inject(HttpClient);

    constructor() {}




    createTicket(companyId: number, messageData: string) {
        console.log('Creating ticket for companyId:', companyId, 'with messageData:', messageData);
        return this.http.post(`${this.url}/chat`, { company_id: companyId, message: messageData });
    }



}
