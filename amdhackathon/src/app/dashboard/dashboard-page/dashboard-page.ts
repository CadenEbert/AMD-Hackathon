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
  sortOption: string = 'date';
  companyId = 1;
  categories$ = this.dashboardService.categories$;
  tickets$ = this.dashboardService.tickets$;
  teams$ = this.dashboardService.teams$;
  resolvedFilter: string = 'unresolved';

  ngOnInit(): void {
    this.dashboardService.loadDashboardData(this.companyId);

  }



  onSortOptionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    console.log('tickets$:', this.tickets$);
    console.log('teams$:', this.teams$);
  }

  onResolvedFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.resolvedFilter = selectElement.value;
  }
}
