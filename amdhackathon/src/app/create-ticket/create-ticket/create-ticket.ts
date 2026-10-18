import { Component } from '@angular/core';
import { CreateTicketService } from '../create-ticket-service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-create-ticket',
  standalone: false,
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.css',
})
export class CreateTicket {
  ticketDescription: string = '';
  uploadType: string = 'text';
  uploading: boolean = false;



  constructor(private createTicketService: CreateTicketService, private cdf: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdf.detectChanges();
  }

  createTicket(companyId: number, messageData: string) {
    this.uploading = true;
    this.cdf.detectChanges();
    this.ticketDescription = '';
    this.createTicketService.createTicket(companyId, messageData).subscribe(
      (response) => {
        this.uploading = false;
        this.cdf.detectChanges();
        console.log('Ticket created successfully:', response);
        window.alert('Ticket created successfully!');

      },
      (error) => {
        this.uploading = false;
        this.cdf.detectChanges();
        console.error('Error creating ticket:', error);
        window.alert('Error creating ticket. Please try again.');
      }
    );
  }

  createAudioTicket(companyId: number, audioFile: File) {
    this.uploading = true;
    this.cdf.detectChanges();

    this.createTicketService.createAudioTicket(companyId, audioFile).subscribe(
      (response) => {
        this.uploading = false;
        this.cdf.detectChanges();
        console.log('Audio ticket created successfully:', response);
        window.alert('Audio ticket created successfully!');
      },
      (error) => {
        this.uploading = false;
        this.cdf.detectChanges();
        console.error('Error creating audio ticket:', error);
        window.alert('Error creating audio ticket. Please try again.');
      }
    );
  }



}
