import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subscription, combineLatest, map } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../dashboard-service';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('ticketChart') ticketChart!: ElementRef<HTMLCanvasElement>;

  companyId = 1;
  sortOption = 'date';
  resolvedFilter = 'unresolved';

  categories$ = this.dashboardService.categories$;
  tickets$ = this.dashboardService.tickets$;
  teams$ = this.dashboardService.teams$;

  private resolvedFilterSubject = new BehaviorSubject<string>(this.resolvedFilter);
  private sortSubject = new BehaviorSubject<string>(this.sortOption);

  private severityChart?: Chart;
  private sub?: Subscription;

  filteredTickets$ = combineLatest([
    this.tickets$,
    this.resolvedFilterSubject,
    this.sortSubject,
  ]).pipe(
    map(([tickets, filter, sort]) => {
      const result = tickets.filter((ticket) => {
        if (filter === 'all') return true;
        if (filter === 'resolved') return ticket.resolved === true;
        return ticket.resolved === false;
      });

      if (sort === 'severity') {
        return result.sort((a, b) => b.severity_score - a.severity_score);
      }
      if (sort === 'severityAsc') {
        return result.sort((a, b) => a.severity_score - b.severity_score);
      }
      return result.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    })
  );

  metrics$ = this.tickets$.pipe(
    map((tickets) => {
      const resolvedTickets = tickets.filter((ticket) => ticket.resolved);
      const openTickets = tickets.filter((ticket) => !ticket.resolved);

      const averageSeverity =
        tickets.length > 0
          ? tickets.reduce((sum, ticket) => sum + ticket.severity_score, 0) /
          tickets.length
          : 0;

      return {
        openCount: openTickets.length,
        resolvedCount: resolvedTickets.length,
        averageSeverity: Number(averageSeverity.toFixed(1)),
      };
    })
  );

  ngOnInit(): void {
    this.dashboardService.loadDashboardData(this.companyId);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.sub = this.filteredTickets$.subscribe((tickets) => {
      const low = tickets.filter((t) => t.severity_score < 4).length;
      const medium = tickets.filter(
        (t) => t.severity_score >= 4 && t.severity_score < 7
      ).length;
      const high = tickets.filter((t) => t.severity_score >= 7).length;
      const chartData = [low, medium, high];

      if (!this.severityChart) {
        this.severityChart = new Chart(this.ticketChart.nativeElement, {
          type: 'pie',
          data: {
            labels: ['Low Severity', 'Medium Severity', 'High Severity'],
            datasets: [
              {
                label: 'Severity Distribution',
                data: chartData,
                backgroundColor: ['#5cf6a9', '#f9d067', '#fd2251'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            plugins: {
              legend: { position: 'bottom' },
            },
          },
        });
      } else {
        this.severityChart.data.datasets[0].data = chartData;
        this.severityChart.update();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.severityChart?.destroy();
  }

  getSeverityClass(score: number): string {
    if (score >= 7) return 'ticket-card-red';
    if (score >= 4) return 'ticket-card-yellow';
    return 'ticket-card-green';
  }

  onSortOptionChange(event: Event): void {
    this.sortOption = (event.target as HTMLSelectElement).value;
    this.sortSubject.next(this.sortOption);
  }

  onResolvedFilterChange(event: Event): void {
    this.resolvedFilter = (event.target as HTMLSelectElement).value;
    this.resolvedFilterSubject.next(this.resolvedFilter);
  }

  resolveTicket(ticketId: number): void {
    this.dashboardService.updateTicket(this.companyId,ticketId, { resolved: true }).subscribe({
      next: (updatedTicket) => {
        console.log('Ticket resolved:', updatedTicket);
        this.dashboardService.loadTickets(this.companyId);
      },
      error: (error) => {
        console.error('Error resolving ticket:', error);
      },
    });
  }


}
