import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CityPipe } from './pipes/city.pipe';
import { TabbedPaneComponent } from './controls/tabbed-pane/tabbed-pane.component';
import { TabComponent } from './controls/tab/tab.component';
import { TabNavigatorComponent } from './controls/tab-navigator/tab-navigator.component';
import { ClickWithWarningDirective } from './controls/click-with-warning.directive';
import { TooltipDirective } from './tooltip.directive';
import { TableFieldDirective } from './controls/data-table/table-field.directive';
import { DataTableComponent } from './controls/data-table/data-table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CityPipe, TabbedPaneComponent, TabComponent, TabNavigatorComponent, ClickWithWarningDirective, TooltipDirective, TableFieldDirective, DataTableComponent],
  exports: [CityPipe, TabbedPaneComponent, TabComponent, TabNavigatorComponent, ClickWithWarningDirective, TooltipDirective, TableFieldDirective, DataTableComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }

  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
