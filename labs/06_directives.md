# Lab: Directives - Deep Dive

- [Lab: Directives - Deep Dive](#lab-directives---deep-dive)
  - [Working with Attribute Directives](#working-with-attribute-directives)
    - [Extending existing Controls with Directives](#extending-existing-controls-with-directives)
    - [Using HostBinding and HostListener](#using-hostbinding-and-hostlistener)
    - [Bonus: Directives and Template Variables *](#bonus-directives-and-template-variables-)
    - [Bonus: Working with Templates and Containers *](#bonus-working-with-templates-and-containers-)
  - [Structural Directives](#structural-directives)
    - [Implement a Simple DataTable](#implement-a-simple-datatable)
    - [Bonus: Custom TemplateOutletDirective ***](#bonus-custom-templateoutletdirective-)


## Working with Attribute Directives

### Extending existing Controls with Directives

1. Add a ``ClickWithWarningDirective``:

    ```
    ng g directive shared/controls/click-with-warning --export
    ```

2. Make sure, the new directive is ``declared`` and ``exported`` in your ``SharedModule``.

3. Open the generated file ``click-with-warning.directive.ts`` and adjust it as follows:
   
    ```typescript
    // src/app/shared/controls/click-with-warning.directive.ts

    // Update imports:
    import { Directive, ElementRef, OnInit } from '@angular/core';

    @Directive({
      selector: '[appClickWithWarning]'
    })
    export class ClickWithWarningDirective implements OnInit {

      constructor(private elementRef: ElementRef) {}

      ngOnInit(): void {
          this.elementRef.nativeElement.setAttribute('class', 'btn btn-danger');
      }
    }
    ```

4. In your ``booking-history.component.html``, create a button with an attribute ``appClickWithWarning``:

    ```html
    <!-- src/app/customer/booking-history/booking-history.component.html -->

    [...]
    <button appClickWithWarning>Delete</button>
    [...]
    ```

5. Start your application (if it isn't still running) and assure yourself that this button is displayed orange (because the directive assigns the classes ``btn`` and ``btn-danger``).

### Using HostBinding and HostListener

1. Open the file ``click-with-warning.directive.ts`` and extend it as follows:

    ```typescript
    // src/app/shared/controls/click-with-warning.directive.ts

    // Update imports:
    import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';

    @Directive({
      selector: '[appClickWithWarning]'
    })
    export class ClickWithWarningDirective implements OnInit {

      // Add Input and Output:
      @Input() warning = 'Are you sure?';
      @Output() appClickWithWarning = new EventEmitter();

      // HostBinding ergänzen
      @HostBinding('class') classBinding: string | undefined;

      constructor(private elementRef: ElementRef) {}

      // HostListener ergänzen:
      @HostListener('click', ['$event.shiftKey'])
      handleClick(shiftKey: boolean): void {
        if (shiftKey || confirm(this.warning)) {
          this.appClickWithWarning.emit();
        }
      }

      ngOnInit(): void {
        // Klassen über HostBinding zuweisen:
        this.classBinding = 'btn btn-danger';
      }
    }
    ```
3. Open the file ``booking-history.component.ts`` and add a delete method with a dummy implementation:

    ```typescript
    delete(): void {
      console.debug('delete ...');
    }
    ```
 
4. Open the template ``booking-history.component.html`` and introduce an event handler for the appClickWithWarning event:

    ```html
    <!-- src/app/customer/booking-history/booking-history.component.html -->

    [...]
    <button (appClickWithWarning)="delete()">Delete</button>
    [...]
    ```

5. Start your application (if it isn't still running) and try it out.
   
### Bonus: Directives and Template Variables *

1. Open the file ``click-with-warning.directive.ts`` and introduce the ``exportAs`` property in the Directive metadata:

    ```typescript
    // src/app/shared/controls/click-with-warning.directive.ts

    @Directive({
      selector: '[appClickWithWarning]',
      exportAs: 'clickWithWarning'
    })
    export class ClickWithWarningDirective implements OnInit {
      [...]
    }
    ```

2. Open the file ``booking-history.component.html``, and introduce a template variable ``cww`` for the button:
   
    ```html
    <!-- src/app/customer/booking-history/booking-history.component.html -->

    [...]

  	<!-- Add #cww -->
    <button (appClickWithWarning)="delete()" #cww="clickWithWarning">Delete</button>

    <!-- Use #cww -->
    <button class="btn btn-danger" (click)="cww.handleClick(true)">Delete without asking questions!</button>
    ```

    Please note that this example assigned ``clickWithWarning`` to ``#cww``. This is the same value that was used together with expertAs above. Because of this, Angular knows, that you don't want to reference the button element but the directive applied to it.

3. Start your application (if it isn't still running) and try it out.

### Bonus: Working with Templates and Containers *

In this bonus lab, you write a ``Tooltip`` directive that adds a template next to the host element and displays it when the mouse cursor is placed over the host. 

   ```html
   <input [appTooltip]="tmpl">
   
   <ng-template #tmpl>
     <h3>2 Tips for Success</h3>
     <ol>
       <li>Don't tell everything!</li>
     </ol>
   </ng-template>
   ```

1. Add a TooltipDirective:

    ```
    ng g d shared/tooltip --export
    ```

2. As always, make sure, this directive is declared and exported in your ``SharedModule``.

3. Open the generated ``tooltip.directive.ts`` and modify it as follows:

    ```typescript
    // src/app/shared/tooltip.directive.ts

    import { Directive, ElementRef, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

    @Directive({
      selector: '[appTooltip]'
    })
    export class TooltipDirective implements OnInit {

      @Input('appTooltip') template: TemplateRef<unknown> | undefined;

      private viewRef: EmbeddedViewRef<unknown> | undefined;

      constructor(private host: ElementRef, private viewContainer: ViewContainerRef) {}

      setHidden(hidden: boolean): void {
        this.viewRef?.rootNodes.forEach(nativeElement => {
          nativeElement.hidden = hidden;
        });
      }

      ngOnInit(): void {
        if (!this.template) {
          return;
        }
        this.viewRef = this.viewContainer.createEmbeddedView(this.template);

        this.setHidden(true);

        const elm = this.host.nativeElement as HTMLElement;
        elm.addEventListener('mouseover', () => {
          this.setHidden(false);
        });

        elm.addEventListener('mouseout', () => {
          this.setHidden(true);
        });
      }
    }
    ```

4. Open the ``BookingHistoryComponent``'s template and add the following elements:

    ```html
    <input [appTooltip]="tmpl">

    <ng-template #tmpl>
      <h3>2 Tips for Success</h3>
      <ol>
        <li>Don't tell everything!</li>
      </ol>
    </ng-template>
    ```

5. Test your solution.

## Structural Directives

### Implement a Simple DataTable

In this lab, you will implement a simple DataTable with configurable fields:

   ```html
   <app-data-table [data]="flights">
     <div *appTableField="let data as 'id'">{{data}}</div>
     <div *appTableField="let data as 'from'">{{data}}</div>
     <div *appTableField="let data as 'to'">{{data}}</div>
     <div *appTableField="let data as 'date'">{{data | date:'dd.MM.yyyy HH:mm'}}</div>
   </app-data-table>
   ```

1. Create a ``TableFieldDirective``:

    ```
    ng generate directive shared/controls/data-table/table-field --export
    ```

2. Ensure yourself that this directive is declared and exported in your ``SharedModule``.

3. Open the generated file ``table-field.directive.ts`` and adjust it as follows:

    ```typescript
    // src/app/shared/controls/data-table/table-field.directive.ts

    import { Directive, Input, TemplateRef } from '@angular/core';

    @Directive({
      selector: '[appTableField]'
    })
    export class TableFieldDirective {

      // eslint-disable-next-line @angular-eslint/no-input-rename
      @Input('appTableFieldAs') propName = '';

      constructor(public templateRef: TemplateRef<any>) { }
    }
    ```

4. Add a ``DataTableComponent``:

    ```
    ng g c shared/controls/data-table --export
    ```

5. As always, ensure yourself that this component is declared and exported in the ``SharedModule``.

6. Open the file ``data-table.component.ts`` and adjust it as follows:

    ```typescript
    // src/app/shared/controls/data-table/data-table.component.ts

    import { Component, ContentChildren, Input, QueryList } from '@angular/core';
    import { TableFieldDirective } from './table-field.directive';

    @Component({
      selector: 'app-data-table',
      templateUrl: './data-table.component.html',
      styleUrls: ['./data-table.component.scss']
    })
    export class DataTableComponent {

      @ContentChildren(TableFieldDirective)
      fields: QueryList<TableFieldDirective> | undefined;

      @Input() data: any[] = [];
   
      get fieldList() {
        return this.fields?.toArray();
      }
    }
    ```

7. Open the ``DataTableComponent``'s template (``data-table.component.html``) and adjust it as follows:
    ```html
    <!-- src/app/shared/controls/data-table/data-table.component.html -->

    <table class="table">
      <tr *ngFor="let row of data">
        <td *ngFor="let f of fieldList">
           <ng-container *ngTemplateOutlet="f.templateRef; context: { $implicit: row[f.propName] }">
           </ng-container>
        </td>
      </tr>
    </table>
    ```

8. In order to try out your solution, open the file ``booking-history.component.ts`` and introduce a ``flights`` array:
   
    ```typescript
    // src/app/customer/booking-history/booking-history.component.ts

    import { Component } from '@angular/core';

    // Import hinzufügen:
    import { Flight } from 'src/app/flight-booking/flight';

    @Component({
      selector: 'app-booking-history',
      templateUrl: './booking-history.component.html',
      styleUrls: ['./booking-history.component.scss']
    })
    export class BookingHistoryComponent {

      // Eigenschaft hinzufügen
      flights: Flight[] = [
        { id: 1, from: 'Hamburg', to: 'Berlin', date: '2025-02-01T17:00+01:00' },
        { id: 2, from: 'Hamburg', to: 'Frankfurt', date: '2025-02-01T17:30+01:00' },
        { id: 3, from: 'Hamburg', to: 'Mallorca', date: '2025-02-01T17:45+01:00' }
      ];
    }
    ```

9. Now, within the ``BookingHistoryComponent``'s template, call your ``DataTable``:
    
    ```html
    <!-- src/app/customer/booking-history/booking-history.component.html -->
    [...]

    <app-data-table [data]="flights">
      <div *appTableField="let data as 'id'">{{data}}</div>
      <div *appTableField="let data as 'from'">{{data}}</div>
      <div *appTableField="let data as 'to'">{{data}}</div>
      <div *appTableField="let data as 'date'">{{data | date:'dd.MM.yyyy HH:mm'}}</div>
    </app-data-table>
    ```

<!-- 
### Bonus: Custom TemplateOutletDirective ***

The TemplateOutletDirective used above leverages a more general low-level concept used by Angular: ViewContainers. They are a logical area representing an element's view. You can use it to insert components dynamically. The following implementation does this by implementing a custom version of the TemplateOutletDirective. Look at it and try to use it in your application:

   ```typescript
   import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
   
   @Directive({
     selector: '[appCustomTemplateOutlet]'
   })
   export class CustomTemplateOutletDirective implements OnInit {
   
     @Input('appCustomTemplateOutlet') template: TemplateRef<any> | undefined;
     @Input('appCustomTemplateOutletContext') context: any;
   
     constructor(private viewContainer: ViewContainerRef) { }
   
     ngOnInit(): void {
       if (!this.template) {
         return;
       }
       this.viewContainer.clear();
   
       this.viewContainer.createEmbeddedView(this.template, this.context);
   
       const ref = this.viewContainer.createEmbeddedView(this.template, this.context);
       const nativeElement = ref.rootNodes.pop();
     }
   }
   ```
 -->
