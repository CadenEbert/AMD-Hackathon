import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Team } from '../models/team.model';
import { Ticket } from '../models/ticket.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url: string = 'http://localhost:3000/api';
  private http = inject(HttpClient);
  private ticketSubject = new BehaviorSubject<Ticket[]>([]);
  tickets$ = this.ticketSubject.asObservable();

  private categorySubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categorySubject.asObservable();

  private teamSubject = new BehaviorSubject<Team[]>([]);
  teams$ = this.teamSubject.asObservable();



  loadDashboardData(companyId: number): void {
    this.loadTickets(companyId);
    this.loadTeams(companyId);
  }

  loadTickets(companyId: number): void {
    this.http.get<Ticket[]>(`${this.url}/tickets/${companyId}`).subscribe((tickets) => {
      this.ticketSubject.next(tickets);
    });
  }

  loadTeams(companyId: number): void {
    this.http.get<Team[]>(`${this.url}/teams/${companyId}`).subscribe((teams) => {
      this.teamSubject.next(teams);
    });
  }

  updateTicket(companyId: number, ticketId: number, updatedData: Partial<Ticket>): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.url}/tickets/${companyId}/${ticketId}`, updatedData);
  }
}
