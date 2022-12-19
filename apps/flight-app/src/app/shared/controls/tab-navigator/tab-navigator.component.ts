import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tab-navigator',
  templateUrl: './tab-navigator.component.html',
  styleUrls: ['./tab-navigator.component.css'] // or .css
})
export class TabNavigatorComponent {
  @Input() page = 0;
  @Input() pageCount = 0;
  @Output() pageChange = new EventEmitter<number>();

  prev(): void {
    if (this.page <= 1) {
      return;
    }
    this.page--;
    this.pageChange.emit(this.page);
  }

  next(): void {
    if (this.page >= this.pageCount) {
      return;
    }
    this.page++;
    this.pageChange.emit(this.page);
  }
}
