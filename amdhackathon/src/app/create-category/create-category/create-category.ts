import { ChangeDetectorRef, Component } from '@angular/core';
import { CreateCategoryService } from '../create-category-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';



@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
})
export class CreateCategory {

  categoryName: string = '';
  categoryDescription: string = '';
  uploading$ = new BehaviorSubject<boolean>(false);
  constructor(private createCategoryService: CreateCategoryService, private cdf: ChangeDetectorRef) { }

  createCategory(companyId: number, name: string, description: string) {
    this.uploading$.next(true);
    console.log('Creating category with name:', name, 'and description:', description);
    this.createCategoryService.createCategory(companyId, name, description).subscribe(
      (response) => {
        this.uploading$.next(false);
        console.log('Category created successfully:', response);
        window.alert('Category created successfully!');
      },
      (error) => {
        this.uploading$.next(false);
        console.error('Error creating category:', error);
        window.alert('Error creating category. Please try again.');
      }
    );
  }
}
