import { Component, inject } from '@angular/core';
import { DashboardService } from '../dashboard-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/internal/operators/map';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

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


  private resolvedFilterSubject = new BehaviorSubject<string>(
    this.resolvedFilter
  );

  filteredTickets$ = combineLatest([
    this.tickets$,
    this.resolvedFilterSubject,
  ]).pipe(
    map(([tickets, filter]) =>
      tickets.filter((ticket) => {
        if (filter === 'all') return true;
        if (filter === 'resolved') return ticket.resolved === true;
        return ticket.resolved === false;
      })
    )
  );

  ngOnInit(): void {
    this.dashboardService.loadDashboardData(this.companyId);

  }

  getSeverityClass(score: number): string {
    if (score >= 7) return 'high-severity';
    if (score >= 4) return 'medium-severity';
    return 'low-severity';
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
    this.resolvedFilterSubject.next(this.resolvedFilter);
  }
}
