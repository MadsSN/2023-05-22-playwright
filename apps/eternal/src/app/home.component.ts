import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Configuration } from "@eternal/shared/config";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "eternal-home",
  template: `<h2 data-testid="greeting">Welcome to Eternal</h2>
  <p data-testid="txt-greeting-1">
    Eternal is an imaginary travel agency and is used as training application
    for Angular developers.
  </p>
  <p data-testid="txt-greeting-2">
    You can click around, do whatever you want but don't expect to be able to
    book a real holiday 😉.
  </p>
  <h3 class="mt-8 text-l font-bold">Settings</h3>
  <p>
    <mat-slide-toggle
      [formControl]="mockCustomers"
      data-testid="tgl-mock-customers"
    >Mock Customers
    </mat-slide-toggle>
  </p>
  <p>
    <mat-slide-toggle
      [formControl]="mockHolidays"
      data-testid="tgl-mock-holidays"
    >Mock Holidays
    </mat-slide-toggle>
  </p> `,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule]
})
export class HomeComponent implements OnInit {
  config = inject(Configuration);

  mockCustomers = new FormControl(true, {
    nonNullable: true
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true
  });

  ngOnInit(): void {
    this.mockCustomers.valueChanges.subscribe((mockCustomers) =>
      this.config.setMockCustomers(mockCustomers)
    );

    this.mockHolidays.valueChanges.subscribe((mockHolidays) =>
      this.config.setMockCustomers(mockHolidays)
    );
  }
}
