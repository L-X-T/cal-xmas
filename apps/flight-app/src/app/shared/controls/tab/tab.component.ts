import { Component, Input } from '@angular/core';
import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent {
  @Input() title = '';
  visible = true;

  constructor(pane: TabbedPaneComponent) {
    pane.register(this);
  }
}
