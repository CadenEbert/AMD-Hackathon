import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CreateTeamService {
  url: string = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  constructor() {}


  createTeam(companyId: number, name: string, supervisorEmail: string, description: string) {
    return this.http.post(`${this.url}/teams/${companyId}`, {  name: name, supervisors_email: supervisorEmail, description: description });
  }
}
