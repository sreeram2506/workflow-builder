import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

/** Observes header chrome height and pushes inset to facade for sidebar layout. */
@Directive({
  selector: '[wbChromeInset]',
  standalone: true,
})
export class ChromeInsetDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly facade = inject(WorkflowFacade);
  private observer: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    const publish = (): void => {
      const h = node.getBoundingClientRect().height;
      this.facade.setChromeInsetTop(h > 0 ? h : 16);
    };
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => publish());
      this.observer.observe(node);
    }
    publish();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
