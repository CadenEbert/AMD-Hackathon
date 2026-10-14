import { Component, inject } from '@angular/core';
import { DashboardService } from '../dashboard-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { Team } from '../../models/team.model';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  private dashboardService = inject(DashboardService);

  companyId = 1;
  tickets$ = this.dashboardService.tickets$;
  teams$ = this.dashboardService.teams$;

  ngOnInit(): void {
    this.dashboardService.loadDashboardData(this.companyId);
  }

  testData(): void {
    console.log('Tickets:', this.tickets$);
    console.log('Teams:', this.teams$);
  }
}
