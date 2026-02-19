import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <h1>AI Workbench</h1>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/chat" routerLinkActive="active">Companion</a>
        <a routerLink="/registry" routerLinkActive="active">Registry</a>
        <a routerLink="/governance" routerLinkActive="active">Governance</a>
      </aside>
      <main class="content"><ng-content /></main>
    </div>
  `
})
export class ShellComponent {}
