import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { DashboardPage } from './dashboard/dashboard-page/dashboard-page';
import {
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [App, DashboardPage],
  imports: [BrowserModule, AppRoutingModule, MatCardModule, MatExpansionModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withEventReplay()), provideHttpClient(withFetch())],
  bootstrap: [App],
})
export class AppModule {}
