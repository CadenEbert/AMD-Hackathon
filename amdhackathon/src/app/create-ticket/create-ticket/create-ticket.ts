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
  selectedAudioFile: File | null = null;
  uploading: boolean = false;





  constructor(private createTicketService: CreateTicketService, private cdf: ChangeDetectorRef) { }

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

  createAudioTicket(companyId: number, audioFile: File | null): void {
    if (!audioFile || this.uploading) {
      return;
    }

    this.uploading = true;

    this.createTicketService
      .createAudioTicket(companyId, audioFile)
      .subscribe({
        next: (response) => {
          this.uploading = false;
          this.selectedAudioFile = null;
          console.log('Audio ticket created successfully:', response);
          window.alert('Audio ticket created successfully!');
          this.cdf.detectChanges();
        },
        error: (error) => {
          this.uploading = false;
          console.error('Error creating audio ticket:', error);
          this.selectedAudioFile = null;
          window.alert('Error creating audio ticket. Please try again.');
          this.cdf.detectChanges();

          window.alert('Error creating audio ticket. Please try again.');
        },
      });
  }


  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedAudioFile = input.files?.[0] ?? null;
  }
}
