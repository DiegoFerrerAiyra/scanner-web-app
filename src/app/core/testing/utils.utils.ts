import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

export function findEl<T>(
    fixture: ComponentFixture<T>,
    testIdOrSelector: string,
): DebugElement {
    return fixture.debugElement.query(
        By.css(testIdOrSelector)
    );
}

export function dispatchFakeEvent(
    element: EventTarget,
    type: string,
    bubbles: boolean = false,
): void {
    const event = document.createEvent('Event');
    event.initEvent(type, bubbles, false);
    element.dispatchEvent(event);
}

export function setFieldElementValue(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    value: string,
): void {
    element.value = value;
    // Dispatch an `input` or `change` fake event
    // so Angular form bindings take notice of the change.
    const isSelect = element instanceof HTMLSelectElement;
    dispatchFakeEvent(element, isSelect ? 'change' : 'input', isSelect ? false : true);
}

export function setFieldValue(element: DebugElement,  value: string) {
    setFieldElementValue(element?.nativeElement, value)
} 
