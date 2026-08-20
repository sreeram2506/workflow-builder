import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { DynamicPropertyComponent } from './dynamic-property.component';

@Component({
  standalone: true,
  imports: [DynamicPropertyComponent],
  template: `
    <wb-dynamic-property
      [key]="key"
      [value]="value"
      [disabled]="disabled"
      (valueChange)="last = $event"
    />
  `,
})
class HostHarness {
  key = 'retryCount';
  value: unknown = 3;
  disabled = false;
  last: unknown;
}

describe('DynamicPropertyComponent', () => {
  it('renders number control for number value and emits edits', async () => {
    const fixture = TestBed.createComponent(HostHarness);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="number"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    // ngModel may lag one tick; assert control kind via presence of number input
    expect(input.type).toBe('number');
    const cmp = fixture.debugElement.children[0].componentInstance as DynamicPropertyComponent;
    expect(cmp.kind()).toBe('number');
    expect(cmp.asNumber()).toBe(3);
    cmp.onNumber(9);
    expect(fixture.componentInstance.last).toBe(9);
  });

  it('readonly JSON for objects', () => {
    const fixture = TestBed.createComponent(HostHarness);
    fixture.componentInstance.value = { a: 1 };
    fixture.detectChanges();
    const ta = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta).toBeTruthy();
    expect(ta.readOnly || ta.disabled).toBe(true);
  });
});
