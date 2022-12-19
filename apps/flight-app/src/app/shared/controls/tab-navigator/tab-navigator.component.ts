import { Component, OnInit } from '@angular/core';
import { TabbedPaneService } from '../tabbed-pane/tabbed-pane.service';

@Component({
  selector: 'app-tab-navigator',
  templateUrl: './tab-navigator.component.html',
  styleUrls: ['./tab-navigator.component.css'] // or .css
})
export class TabNavigatorComponent implements OnInit {
  page = 0;
  pageCount = 0;

  // Inject service here:
  constructor(private tabbedPaneService: TabbedPaneService) {}

  ngOnInit(): void {
    // Subscribe to service:
    this.tabbedPaneService.pageCount.subscribe((pageCount) => {
      this.pageCount = pageCount;
    });
    this.tabbedPaneService.currentPage.subscribe((page) => {
      this.page = page;
    });
  }

  prev(): void {
    if (this.page <= 1) {
      return;
    }
    this.page--;

    // Notify service:
    this.tabbedPaneService.currentPage.next(this.page);
  }

  next(): void {
    if (this.page >= this.pageCount) {
      return;
    }
    this.page++;

    // Notify service:
    this.tabbedPaneService.currentPage.next(this.page);
  }
}
