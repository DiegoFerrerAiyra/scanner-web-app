import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthComponent } from "../auth.page";
import { provideMockStore } from "@ngrx/store/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "@shared/shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MessageService } from "primeng/api";

describe("AuthComponent", () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  // let store: MockStore<UserState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterTestingModule,SharedModule, HttpClientTestingModule],
      providers: [provideMockStore(), MessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    // store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
