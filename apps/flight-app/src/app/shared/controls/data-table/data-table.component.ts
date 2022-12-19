import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { TableFieldDirective } from './table-field.directive';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @ContentChildren(TableFieldDirective)
  fields: QueryList<TableFieldDirective> | undefined;

  @Input() data: any[] = [];

  get fieldList() {
    return this.fields?.toArray();
  }
}
