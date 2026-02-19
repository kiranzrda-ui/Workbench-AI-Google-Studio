import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ChatComponent } from './features/chat/chat.component';
import { RegistryComponent } from './features/registry/registry.component';
import { GovernanceComponent } from './features/governance/governance.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'registry', component: RegistryComponent },
  { path: 'governance', component: GovernanceComponent }
];
