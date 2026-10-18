import { Component } from '@angular/core';
import { CreateTeamService } from '../create-team-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Component({
  selector: 'app-create-team',
  standalone: false,
  templateUrl: './create-team.html',
  styleUrl: './create-team.css',
})
export class CreateTeam {

  teamName: string = '';
  supervisorEmail: string = '';
  teamDescription: string = '';
  uploading$ = new BehaviorSubject<boolean>(false);

  constructor(private createTeamService: CreateTeamService) { }


  createTeam(companyId: number, name: string, supervisorEmail: string, description: string) {
    this.uploading$.next(true);
    console.log('Creating team with name:', name, 'supervisor email:', supervisorEmail, 'and description:', description);
    this.createTeamService.createTeam(companyId, name, supervisorEmail, description).subscribe(
      (response) => {
        this.uploading$.next(false);
        console.log('Team created successfully:', response);
        window.alert('Team created successfully!');
      },
      (error) => {
        this.uploading$.next(false);
        console.error('Error creating team:', error);
        window.alert('Error creating team. Please try again.');
      }
    );
  }
}
