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
    map(([tickets, filter]) => {
      const filteredTickets = tickets.filter((ticket) => {
        if (filter === 'all') return true;
        if (filter === 'resolved') return ticket.resolved === true;
        return ticket.resolved === false;
      });
      return [...filteredTickets].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    })
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
    this.filteredTickets$ = combineLatest([
      this.tickets$,
      this.resolvedFilterSubject,
    ]).pipe(
      map(([tickets, filter]) => {
        let filteredTickets = tickets.filter((ticket) => {
          if (filter === 'all') return true;
          if (filter === 'resolved') return ticket.resolved === true;
          return ticket.resolved === false;
        });

        if (this.sortOption === 'date') {
          return filteredTickets.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        } else if (this.sortOption === 'severity') {
          return filteredTickets.sort(
            (a, b) => b.severity_score - a.severity_score
          );
        } else if (this.sortOption === 'severityAsc') {
          return filteredTickets.sort(
            (a, b) => a.severity_score - b.severity_score
          );
        }
        return filteredTickets;
      })
    );


  }

  onResolvedFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.resolvedFilter = selectElement.value;
    this.resolvedFilterSubject.next(this.resolvedFilter);
  }
}
