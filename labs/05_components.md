# Labs: Components Deep Dive


- [Labs: Components Deep Dive](#labs-components-deep-dive)
  - [Getting Started](#getting-started)
  - [Content and View](#content-and-view)
    - [Content Projection](#content-projection)
    - [Referencing the Parent Component](#referencing-the-parent-component)
    - [Interacting with a Component's Content](#interacting-with-a-components-content)
    - [Interacting with a Component's View](#interacting-with-a-components-view)
      - [Creating a TabNavigatorComponent](#creating-a-tabnavigatorcomponent)
      - [Using Template Variables](#using-template-variables)
      - [Bonus: Directly Accessing a ViewChild *](#bonus-directly-accessing-a-viewchild-)
      - [Bonus: Communicating via Services *](#bonus-communicating-via-services-)

## Getting Started

<!-- 
TODO: Diesen Abschnitt eventuell ins Starterkit verschieben?
-->

For this lab, we are ausin a new ``CustomerModule`` with a ``BookingHistoryComponent``. This part of the lab shows how to create them.

1. Create a new ``CustomerModule``:

    ```
    ng g module customer
    ```

2. Create a new ``BookingHistoryComponent``:

    ```
    ng g c customer/booking-history
    ```

3. Add a file ``customer.routes.ts`` with a routing configuration for the new module:

    ```typescript
    // src/app/customer/customer.routes.ts

    import { Routes } from '@angular/router';
    import { BookingHistoryComponent } from './booking-history/booking-history.component';

    export const CUSTOMER_ROUTES: Routes = [
      {
        path: 'customer/booking-history',
        component: BookingHistoryComponent
      }
    ];
    ```

4. Import both, the existing ``SharedModule`` as well as the ``RouterModule`` into the new ``CustomerModule``. Also, pass your routing config to the ``RouterModule``'s ``forChild``-Method.
   
    ```typescript
    // src/app/customer/customer.module.ts

    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { BookingHistoryComponent } from './booking-history/booking-history.component';

    // Add imports:
    import { RouterModule } from '@angular/router';
    import { CUSTOMER_ROUTES } from './customer.routes';
    import { SharedModule } from '../shared/shared.module';

    @NgModule({
      imports: [
        CommonModule,
        // Add SharedModule:
        SharedModule,
        // Add RouterModule + Routing Config:
        RouterModule.forChild(CUSTOMER_ROUTES)
      ],
      declarations: [BookingHistoryComponent]
    })
    export class CustomerModule { }
    ```

    Please note that we have changed the order of _imports_ and _declarations_ compared to the generated.

5. Import the _CustomerModule_ into the  _AppModule_:

    ```typescript
    // src/app/app.module.ts

    [...]
    // Add import:
    import { CustomerModule } from './customer/customer.module';

    @NgModule({
      imports: [
        [...]
        // Add module:
        CustomerModule
      ],
      declarations: [
        [...]   
      ],
      providers: [],
      bootstrap: [
        AppComponent
      ]
    })
    export class AppModule { }
    ```

6. Add a menu item to your _SidebarComponent_:

    ```html
    <!-- src/app/sidebar/sidebar.component.html -->
    
    [...]

    <li routerLinkActive="active"> 
      <a routerLink="customer/booking-history">
        <p>Booking History</p>
      </a>
    </li> 
    [...]
    ```

7. Start your application (if it isn't still running) and try it out.
   
## Content and View

In this part of the lab, you will implement a tabbed pane. We use it to demonstrate advanced possibilities of Angular.

### Content Projection

1. Add a ``TabbedPaneComponent`` and a ``TabComponent``:

    ```
    ng g c shared/controls/tabbed-pane --export
    ng g c shared/controls/tab --export
    ```

2. Please make sure that both components are both declared and exported as the _SharedModule_.

3. Open the generated ``tab.component.ts`` file and add a ``title`` and a ``visible`` property:

    ```typescript
    // src/app/shared/controls/tab/tab.component.ts

    import { Component, Input } from '@angular/core';

    @Component({
      selector: 'app-tab',
      templateUrl: './tab.component.html',
      styleUrls: ['./tab.component.scss']
    })
    export class TabComponent {
      @Input() title = '';
      visible = true;
    }
    ```

4. Open the generated ``tab.component.html`` file and modify it as follow:
   
    ```html
    <!-- src/app/shared/controls/tab/tab.component.html -->

    <div *ngIf="visible">
      <h2>{{title}}</h2>
      <ng-content></ng-content>
    </div>
    ```

    Please note that the ``ng-content`` element marks the destination for content projection.

5. Try out your TabComponent. For this, switch to the file ``booking-history.component.html`` and call it three times:
   
    ```html
    <!-- src/app/customer/booking-history/booking-history.component.html -->

    <h1>Booking History</h1>

    <app-tab title="Upcoming Flights">
      <p>No upcoming flights!</p>
    </app-tab>

    <app-tab title="Operated Flights">
      <p>No operated flights!</p>
    </app-tab>

    <app-tab title="Cancelled Flights">
      <p>No cancelled flights!</p>
    </app-tab>
    ```

6. Start your application (if it isn't still running) and assure yourself that the three tabs are displayed **one after the other** including the projected content.
   
   In the **next section**, we will group them using our ``TabbedPaneComponent``. Also, we will make sure that only one tab is displayed at one time.

### Referencing the Parent Component

The goal of this lab is to group the tabs with a tabbed-pane. Also, the tabbed-pane shall make sure that only one tab is displayed at a time and display links for switching between them:

   ```html
   <app-tabbed-pane>
     <app-tab title="Upcoming Flights">
       <p>No upcoming flights!</p>
     </app-tab>
  
     <app-tab title="Operated Flights">
       <p>No operated flights!</p>
     </app-tab>
  
     <app-tab title="Cancelled Flights">
       <p>No cancelled flights!</p>
     </app-tab>
   </app-tabbed-pane>
   ```

1. Open the file ``tabbed-pane.component.ts`` and extend it as follows:
   
    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts

    import { AfterContentInit, Component } from '@angular/core';
    import { TabComponent } from '../tab/tab.component';

    @Component({
      selector: 'app-tabbed-pane',
      templateUrl: './tabbed-pane.component.html',
      styleUrls: ['./tabbed-pane.component.scss']
    })
    export class TabbedPaneComponent implements AfterContentInit {
      tabs: TabComponent[] = [];
      activeTab: TabComponent | undefined;

      ngAfterContentInit(): void {
        if (this.tabs.length > 0) {
          this.activate(this.tabs[0]);
        }
      }

      register(tab: TabComponent): void {
        this.tabs.push(tab);
      }

      activate(active: TabComponent): void {
        for (const tab of this.tabs) {
          tab.visible = (tab === active);
        }
        this.activeTab = active;
      }
    }
    ```

2. Also, open the component's template (``tabbed-pane.component.html``) and display a link for each managed ``TabComponent`` in the ``tabs`` array:
   
    ```html
    <!-- src/app/shared/controls/tabbed-pane/tabbed-pane.component.html -->

    <div class="tabbed-pane">
        
      <div class="navigation">
        <span *ngFor="let tab of tabs" class="tab-link">
          <a [ngClass]="{active: tab == activeTab}" (click)="activate(tab)">{{tab.title}}</a>
        </span>
      </div>

      <ng-content></ng-content>
    </div>
    ```

3. You can use the following CSS rules in the file ``tabbed-pane.component.scss`` (or ``tabbed-pane.component.css``) to style your ``TabbedPaneCompnent``:
   
    ```css
    /* src/app/shared/controls/tabbed-pane/tabbed-pane.component.(s)css */

    .navigation {
      margin-bottom: 30px;
    }

    .tab-link {
      font-size: 16px;
      padding-bottom: 3px;
      border-bottom: 5px solid darkseagreen;
      margin-right: 10px;
    }

    .tab-link a {
      color: black;
      cursor: pointer;
    }

    .tab-link a:hover {
      color: orangered;
      text-decoration: none;
    }

    .tab-link a.active {
      color: orangered;
    }
    ```

4. Now, make the ``TabComponent`` to register itself with its parent ``TabbedPaneComponent``. For this, open the file ``tab.component.ts``, inject the ``TabbedPaneComponent`` and call the previously created ``register`` method:

    ```typescript
    // src/app/shared/controls/tab/tab.component.ts

    import { Component, Input } from '@angular/core';
    import { TabbedPaneComponent } from '../tabbed-pane/tabbed-pane.component';

    @Component({
      selector: 'app-tab',
      templateUrl: './tab.component.html',
      styleUrls: ['./tab.component.scss']
    })
    export class TabComponent {
      @Input() title = '';
      visible = true;

      constructor(pane: TabbedPaneComponent) {
        pane.register(this);
      }
    }
    ```

5. Open the file ``booking-history.component.html`` and group your ``tabs`` with a ``tabbed-pane`` element:

    ```html
    <app-tabbed-pane>
      <app-tab title="Upcoming Flights">
        <p>No upcoming flights!</p>
      </app-tab>

      <app-tab title="Operated Flights">
        <p>No operated flights!</p>
      </app-tab>

      <app-tab title="Cancelled Flights">
        <p>No cancelled flights!</p>
      </app-tab>
    </app-tabbed-pane>
    ```

6. Start your application (if it isn't still running) and assure yourself that the tabbed pane is woking as indented.

### Interacting with a Component's Content

In this lab, you make your TabbedPane to directly interact with its TabComponent children. For this, you query them as content children.

1. Open the file ``tabbed-pane.component.ts`` and query the nested ``TabComponents`` using ``ContentChildren``:

    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts

    import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
    import { TabComponent } from '../tab/tab.component';

    @Component({
      selector: 'app-tabbed-pane',
      templateUrl: './tabbed-pane.component.html',
      styleUrls: ['./tabbed-pane.component.scss']
    })
    export class TabbedPaneComponent implements AfterContentInit {

      @ContentChildren(TabComponent)
      tabQueryList: QueryList<TabComponent> | undefined;

      activeTab: TabComponent | undefined;
      currentPage = 1;

      get tabs(): TabComponent[] {
        return this.tabQueryList?.toArray() ?? [];
      }

      ngAfterContentInit(): void {
        if (this.tabs.length > 0) {
          this.activate(this.tabs[0]);
        }
      }

      [...]
    }
    ```

    Please note, that we've exchanged the existing tabs property by a getter, returning the queried ``TabComponents`` as a traditional array.

2. Now, you don't need to inject the ``TabbedPaneComponent`` into the ``TabComponent`` and call its ``register`` method anymore. Hence, open the file ``tab.component.ts`` and simplify it as follows:

    ```typescript
    // src/app/shared/controls/tab/tab.component.ts

    import { Component, Input } from '@angular/core';

    @Component([...])
    export class TabComponent {
      @Input() title = '';
      visible = true;
    }
    ```

### Interacting with a Component's View

Now, let's interact with the ``TabbedPane``'s view using ``ViewChild``.

#### Creating a TabNavigatorComponent

1. Create a new ``TabNavigatorComponent``:
   
    ```
    ng g c shared/controls/tab-navigator --export
    ```

2. Open the file ``tab-navigator.component.ts`` and extend it as follows:

    ```typescript
    // src/app/shared/controls/tab-navigator/tab-navigator.component.ts

    import { Component, EventEmitter, Input, Output } from '@angular/core';

    @Component({
      selector: 'app-tab-navigator',
      templateUrl: './tab-navigator.component.html',
      styleUrls: ['./tab-navigator.component.scss'] // or .css
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
    ```

3. Open the file ``tab-navigator.component.html`` and extend it as follows: 

    ```html
    <!-- src/app/shared/controls/tab-navigator/tab-navigator.component.html -->

    <div class="tab-navigator">
        <button class="prev" (click)="prev()">&lt;&lt;</button>
        # {{page}}
        <button class="next" (click)="next()">&gt;&gt;</button>
    </div>
    ```

4. You can style this component using the following CSS rules in the file ``tab-navigator.component.scss`` (or ``.css``)
   
    ```css
    /* src/app/shared/controls/tab-navigator/tab-navigator.component.scss */

    .tab-navigator {
      border: 2px solid black;
      width: 150px;
    }

    .tab-navigator button {
      border: none;
      background-color: inherit;
    }

    .tab-navigator .next {
      float: right;
    }
    ```


5. Open the file ``tabbed-pane.component.html`` and call the new ``app-tab-navigator`` element at the end:

    ```html
    <!-- src/app/shared/controls/tabbed-pane/tabbed-pane.component.html -->

    <div class="tabbed-pane">

      [...]

      <app-tab-navigator 
        [page]="this.currentPage" 
        [pageCount]="this.tabs.length"
        (pageChange)="pageChange($event)">
      </app-tab-navigator>
    </div>
    ```

6. Open the file ``tabbed-pane.component.ts`` and introduce a property ``currentPage``. Update it after a changing the page:
   
    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts

    import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
    import { TabComponent } from '../tab/tab.component';

    @Component({
      selector: 'app-tabbed-pane',
      templateUrl: './tabbed-pane.component.html',
      styleUrls: ['./tabbed-pane.component.scss']
    })
    export class TabbedPaneComponent implements AfterContentInit {

      @ContentChildren(TabComponent)
      tabQueryList: QueryList<TabComponent> | undefined;

      activeTab: TabComponent | undefined;

      // Add:
      currentPage = 0;

      get tabs(): TabComponent[] {
        return this.tabQueryList?.toArray() ?? [];
      }

      ngAfterContentInit(): void {
        if (this.tabs.length > 0) {
          this.activate(this.tabs[0]);
        }
      }

      activate(active: TabComponent): void {
        for (const tab of this.tabs) {
          tab.visible = (tab === active);
        }
        this.activeTab = active;

        // Add:
        this.currentPage = this.tabs.indexOf(active) + 1;
      }

      // Add:
      pageChange(page: number): void {
        this.activate(this.tabs[page - 1]);
      }
    }
    ```

6. Start your application (if it isn't still running) and assure yourself that the tabbed pane is woking as indented.

#### Using Template Variables

Open the file ``tabbed-pane.component.html`` and introduce a template variable for the ``app-tab-navigator`` using ``#navigator``. Use this template variable to display the current page and to provide two additional buttons for navigating between the tabs (using the ``prev`` and ``next`` method):
   
   ```html
   <!-- src/app/shared/controls/tabbed-pane/tabbed-pane.component.html -->
   
   <div class="tabbed-pane">
   
     [...]
   
     <app-tab-navigator 
       #navigator
       [page]="currentPage"
       [pageCount]="this.tabs.length"
       (pageChange)="pageChange($event)">
     </app-tab-navigator>
   
     <div>
       <button (click)="navigator.prev()">Prev</button>
       {{navigator.page}}
       <button (click)="navigator.next()">Next</button>
     </div>
   
   </div>
   ```

#### Bonus: Directly Accessing a ViewChild *

Normally, using data bindings is the prefered way of communicating with child components. However, if a needed property or event does not exist, you can directly access your child components via ViewChilds. This section demonstrates this.


1. Open the ``tabbed-pane.component.html`` and remove some of the data-bindings for the ``app-tab-navigator`` element (but not (!) ``page``):
   
    ```html
    <!-- src/app/shared/controls/tabbed-pane/tabbed-pane.component.html -->

    <div class="tabbed-pane">
      [...]

      <app-tab-navigator [page]="currentPage" #navigator>
      </app-tab-navigator>
    </div>
    ```

2. Now, open the file ``tabbed-pane.component.ts`` and fetch the ``TabNavigatorComponent`` using the ``ViewChild`` decorator:
   
    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts

    // Import ViewChild:
    import { AfterContentInit, AfterViewInit, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';

    // Add:
    import { TabNavigatorComponent } from '../tab-navigator/tab-navigator.component';

    import { TabComponent } from '../tab/tab.component';

    @Component([...])
    export class TabbedPaneComponent implements AfterContentInit, AfterViewInit {
      @ContentChildren(TabComponent)
      tabQueryList: QueryList<TabComponent> | undefined;

      // Add:
      @ViewChild('navigator')
      navigator: TabNavigatorComponent | undefined;

      activeTab: TabComponent | undefined;
      currentPage = 0;

      get tabs(): TabComponent[] {
        return this.tabQueryList?.toArray() ?? [];
      }

      // Directly interact with the navigator
      ngAfterViewInit(): void {
        if (this.navigator) {
          this.navigator.pageCount = this.tabs.length;
          // This line would cause a cycle:
          // this.navigator.page = 1;
          this.navigator.pageChange.subscribe((page: number) => {
            this.pageChange(page);
          });
        }
      }

      ngAfterContentInit(): void {
        if (this.tabs.length > 0) {
          this.activate(this.tabs[0]);
        }
      }
   
      [...]
    }

3. Start your application (if it isn't still running) and assure yourself that the tabbed pane is woking as indented.



#### Bonus: Communicating via Services *

1. Add a ``TabbedPaneService``:

    ```
    ng g s shared/controls/tabbed-pane/tabbed-pane
    ```

2. Open the file ``tabbed-pane.service.ts`` and modify it as follows:
   
    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.service.ts

    import { Injectable } from '@angular/core';
    import { BehaviorSubject, Subject } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class TabbedPaneService {
      readonly pageCount = new BehaviorSubject<number>(0);
      readonly currentPage = new BehaviorSubject<number>(1);
    }
    ```

3. Open the file ``tabbed-pane.component.ts`` and register the ``TabbedPaneService`` directly in the Component decorator. Also, inject it into the constructor:
   
    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts

    [...]

    // Add import:
    import { TabbedPaneService } from './tabbed-pane.service';

    @Component({
      [...]
      
      // Add provider:
      providers: [TabbedPaneService]
    })
    export class TabbedPaneComponent implements OnInit, AfterContentInit, AfterViewInit {

      [...]
      
      constructor(private service: TabbedPaneService) {}

      [...]
    }
    ```

4. In the same file, update the ``ngAfterViewInit`` and ``activate`` methods as follows:

    ```typescript
    // src/app/shared/controls/tabbed-pane/tabbed-pane.component.ts
   
    [...]

    // Update this method:
    ngAfterViewInit(): void {
      this.service.pageCount.next(this.tabs.length);
      this.service.currentPage.subscribe((page: number) => {
        // Prevent cycle:
        if (page === this.currentPage) {
          return;
        }
        this.pageChange(page);
      });
    }

    [...]

    activate(active: TabComponent): void {
      for (const tab of this.tabs) {
        tab.visible = (tab === active);
      }
      this.activeTab = active;
   
      // Update:
      this.currentPage = this.tabs.indexOf(active) + 1;
      this.service.currentPage.next(this.currentPage);
    }
    ```

5. Also, open the file ``tab-navigator.component.ts`` and inject the ``TabbedPaneService``. Use it to communicate with the ``TabbedPaneComponent``:
   
    ```typescript
    // src/app/shared/controls/tab-navigator/tab-navigator.component.ts

    import { Component, OnInit } from '@angular/core';
    import { TabbedPaneService } from '../tabbed-pane/tabbed-pane.service';

    @Component({
      selector: 'app-tab-navigator',
      templateUrl: './tab-navigator.component.html',
      styleUrls: ['./tab-navigator.component.scss']
    })
    export class TabNavigatorComponent implements OnInit {
      // No inputs anymore:
      page = 0;
      pageCount = 0;

      // Inject service here:
      constructor(private service: TabbedPaneService) {}

      ngOnInit(): void {
        // Subscribe to service:
        this.service.pageCount.subscribe(pageCount => {
          this.pageCount = pageCount;
        });
        this.service.currentPage.subscribe(page => {
          this.page = page;
        });
      }

      prev(): void {
        if (this.page <= 1) {
          return;
        }
        this.page--;

        // Notify service:
        this.service.currentPage.next(this.page);
      }

      next(): void {
        if (this.page >= this.pageCount) {
          return;
        }
        this.page++;

        // Notify service:
        this.service.currentPage.next(this.page);
      }
    }
    ```
