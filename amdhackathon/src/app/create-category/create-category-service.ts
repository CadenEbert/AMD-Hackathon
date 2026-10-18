import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';


export interface CreateCategoryResponse {
  id: number;
  company_id: number;
  name: string;
  description: string;
}
@Injectable({
  providedIn: 'root',
})
export class CreateCategoryService {

  url: string = 'http://localhost:3000/api';
  private http = inject(HttpClient);



  createCategory(companyId: number, categoryName: string, categoryDescription: string){
    return this.http.post<CreateCategoryResponse>(`${this.url}/categories`, { company_id: companyId, name: categoryName, description: categoryDescription });
  }
}
