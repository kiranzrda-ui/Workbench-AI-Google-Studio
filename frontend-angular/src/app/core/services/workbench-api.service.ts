import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ModelSummary } from '../models/model';

@Injectable({ providedIn: 'root' })
export class WorkbenchApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getModels(): Observable<ModelSummary[]> {
    return this.http.get<ModelSummary[]>(`${this.baseUrl}/models`);
  }

  sendMessage(persona: string, content: string): Observable<{ reply: string; toolCalls: string[] }> {
    return this.http.post<{ reply: string; toolCalls: string[] }>(`${this.baseUrl}/chat/messages`, {
      persona,
      messages: [{ role: 'user', content, timestampUtc: new Date().toISOString() }]
    });
  }
}
