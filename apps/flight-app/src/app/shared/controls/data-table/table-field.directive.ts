import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTableField]'
})
export class TableFieldDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('appTableFieldAs') propName = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
