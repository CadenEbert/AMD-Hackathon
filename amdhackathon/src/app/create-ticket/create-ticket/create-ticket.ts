import { Component } from '@angular/core';

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


}
