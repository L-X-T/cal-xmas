import { Directive, ElementRef, EmbeddedViewRef, HostListener, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
  @Input('appTooltip') template: TemplateRef<unknown> | undefined;

  private viewRef: EmbeddedViewRef<unknown> | undefined;

  constructor(private host: ElementRef, private viewContainer: ViewContainerRef) {}

  // Add HostListeners
  @HostListener('mouseover')
  show(): void {
    this.setHidden(false);
  }

  @HostListener('mouseout')
  hide(): void {
    this.setHidden(true);
  }

  ngOnInit(): void {
    if (!this.template) {
      return;
    }

    this.viewRef = this.viewContainer.createEmbeddedView(this.template);

    this.setHidden(true);
  }

  private setHidden(isHidden: boolean): void {
    this.viewRef?.rootNodes.forEach((nativeElement) => {
      nativeElement.hidden = isHidden;
    });
  }
}
