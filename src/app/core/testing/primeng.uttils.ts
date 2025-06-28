import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Dropdown } from "primeng/dropdown";

export function setValueDropdown<T>(fixture: ComponentFixture<T>, label:string, selectValue:string) {
    const dropdown:Dropdown = fixture.debugElement.query(By.directive(Dropdown)).componentInstance;

    dropdown.selectItem('change', { label: label, value: selectValue });
    dropdown.onChange.emit({ value: selectValue });
}