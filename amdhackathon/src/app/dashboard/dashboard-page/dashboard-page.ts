import { Component } from '@angular/core';
import { DashboardService } from '../dashboard-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  constructor(private dashboardService: DashboardService) {}

  getTickets() {
    this.dashboardService.getTickets().subscribe((tickets) => {
      console.log(tickets);
    });
  }

}
