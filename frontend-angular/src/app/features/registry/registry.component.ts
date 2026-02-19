import { Component, OnInit } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { WorkbenchApiService } from '../../core/services/workbench-api.service';
import { ModelSummary } from '../../core/models/model';

@Component({
  selector: 'app-registry',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  template: `
    <h2>Model Registry</h2>
    <pre>{{ models$ | async | json }}</pre>
  `
})
export class RegistryComponent implements OnInit {
  models$?: Observable<ModelSummary[]>;

  constructor(private readonly api: WorkbenchApiService) {}

  ngOnInit(): void {
    this.models$ = this.api.getModels();
  }
}
