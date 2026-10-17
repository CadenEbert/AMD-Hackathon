import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CreateTicket } from './create-ticket/create-ticket/create-ticket';
import { CreateTeam } from './create-team/create-team/create-team';
import { CreateCategory } from './create-category/create-category/create-category';
@NgModule({
  declarations: [App, DashboardPage, CreateTicket, CreateTeam, CreateCategory],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatExpansionModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
