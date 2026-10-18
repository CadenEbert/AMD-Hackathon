import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateTicketService {
    url: string = 'http://localhost:8000';
    backendUrl: string = 'http://localhost:3000';
    private http = inject(HttpClient);

    constructor() {}




    createTicket(companyId: number, messageData: string) {
        console.log('Creating ticket for companyId:', companyId, 'with messageData:', messageData);
        return this.http.post(`${this.url}/chat`, { company_id: companyId, message: messageData });
    }

    createAudioTicket(companyId: number, audioFile: File) {
        const formData = new FormData();
        formData.append('company_id', companyId.toString());
        formData.append('audio', audioFile);
        return this.http.post(`${this.backendUrl}/api/audio/call/${companyId}`, formData);
    }

}
