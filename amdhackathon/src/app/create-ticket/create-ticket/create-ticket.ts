import { Component } from '@angular/core';
import { CreateTicketService } from '../create-ticket-service';
@Component({
  selector: 'app-create-ticket',
  standalone: false,
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  ticketTitle: string = '';
  ticketDescription: string = '';
  uploadType: string[] = ['Text', 'Audio', 'Email'];



  constructor(private createTicketService: CreateTicketService) {

  }

  createTicket(companyId: number, messageData: string) {
    this.createTicketService.createTicket(companyId, messageData).subscribe(
      (response) => {
        console.log('Ticket created successfully:', response);
        window.alert('Ticket created successfully!');
      },
      (error) => {
        console.error('Error creating ticket:', error);
        window.alert('Error creating ticket. Please try again.');
      }
    );
  }

}
