import { AfterContentInit, AfterViewInit, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { TabNavigatorComponent } from '../tab-navigator/tab-navigator.component';
import { TabComponent } from '../tab/tab.component';
import { TabbedPaneService } from './tabbed-pane.service';

@Component({
  selector: 'app-tabbed-pane',
  templateUrl: './tabbed-pane.component.html',
  styleUrls: ['./tabbed-pane.component.css'],
  providers: [TabbedPaneService]
})
export class TabbedPaneComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(TabComponent)
  tabQueryList: QueryList<TabComponent> | undefined;

  @ViewChild('navigator')
  navigator: TabNavigatorComponent | undefined;

  activeTab: TabComponent | undefined;
  currentPage = 1;

  get tabs(): TabComponent[] {
    return this.tabQueryList?.toArray() ?? [];
  }

  constructor(private tabbedPaneService: TabbedPaneService) {}

  ngAfterContentInit(): void {
    if (this.tabs.length > 0) {
      this.activate(this.tabs[0]);
    }
  }

  // Directly interact with the navigator
  ngAfterViewInit(): void {
    if (this.navigator) {
      this.tabbedPaneService.pageCount.next(this.tabs.length);
      this.tabbedPaneService.currentPage.subscribe((page: number) => {
        // Prevent cycle:
        if (page === this.currentPage) {
          return;
        }
        this.pageChange(page);
      });
    }
  }

  activate(active: TabComponent): void {
    for (const tab of this.tabs) {
      tab.visible = tab === active;
    }
    this.activeTab = active;

    // Update:
    this.currentPage = this.tabs.indexOf(active) + 1;
    this.tabbedPaneService.currentPage.next(this.currentPage);
  }

  pageChange(page: number): void {
    this.activate(this.tabs[page - 1]);
  }
}
