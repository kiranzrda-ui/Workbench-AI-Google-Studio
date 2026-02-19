import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkbenchApiService } from '../../core/services/workbench-api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>AI Companion</h2>
    <textarea [(ngModel)]="prompt" rows="4"></textarea>
    <button (click)="send()">Send</button>
    <pre>{{ response }}</pre>
  `
})
export class ChatComponent {
  prompt = '';
  response = '';

  constructor(private readonly api: WorkbenchApiService) {}

  send(): void {
    this.api.sendMessage('Data Scientist', this.prompt).subscribe((result) => {
      this.response = `${result.reply}\nTools: ${result.toolCalls.join(', ')}`;
    });
  }
}
