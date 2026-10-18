import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';
import { CreateTicket } from './create-ticket/create-ticket/create-ticket';
import { CreateTeam } from './create-team/create-team/create-team';
import { CreateCategory } from './create-category/create-category/create-category';




const routes: Routes = [
    {
      path: '',
      redirectTo: '/dashboard',
      pathMatch: 'full'
    },
    {
      path: 'dashboard',
      component: DashboardPage
    },
    {
      path: 'create-ticket',
      component: CreateTicket
    },
    {
      path: 'create-team',
      component: CreateTeam
    },
    {
      path: 'create-category',
      component: CreateCategory
    }
  ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

