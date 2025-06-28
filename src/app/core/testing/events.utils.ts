import { ComponentFixture } from "@angular/core/testing";
import { findEl } from "./utils.utils";

export function makeEvent(
    target: EventTarget,
    typeEvent: string
): Partial<MouseEvent> {
    return {
        preventDefault(): void { },
        stopPropagation(): void { },
        stopImmediatePropagation(): void { },
        type: typeEvent,
        target,
        currentTarget: target,
        bubbles: true,
        cancelable: true,
        button: 0
    };
}

export function click<T>(
    fixture: ComponentFixture<T>,
    testIdOrSelector: string
): void {
    const element = findEl(fixture, testIdOrSelector);
    const event = makeEvent(element.nativeElement, 'click');
    element.triggerEventHandler('click', event);
}

export function submit<T>(
    fixture: ComponentFixture<T>,
    testIdOrSelector: string,
): void {
    const element = findEl(fixture, testIdOrSelector);
    const event = makeEvent(element.nativeElement, 'submit');
    element.triggerEventHandler('submit', event);
}