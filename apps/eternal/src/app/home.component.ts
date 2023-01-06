import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Configuration } from '@eternal/shared/config';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TestidDirective } from '../../../../libs/shared/ui/src/lib/testid.directive';

@Component({
  selector: 'eternal-home',
  template: `<h2 testid="greeting">Welcome to Eternal</h2>
    <p testid="txt-greeting-1">
      Eternal is an imaginary travel agency and is used as training application
      for Angular developers.
    </p>
    <p testid="txt-greeting-2">
      You can click around, do whatever you want but don't expect to be able to
      book a real holiday 😉.
    </p>
    <h3 class="mt-8 text-l font-bold">Settings</h3>
    <p>
      <mat-slide-toggle
        [formControl]="mockCustomers"
        testid="tgl-mock-customers"
        >Mock Customers
      </mat-slide-toggle>
    </p>
    <p>
      <mat-slide-toggle [formControl]="mockHolidays" testid="tgl-mock-holidays"
        >Mock Holidays
      </mat-slide-toggle>
    </p>
    <p>
      <mat-slide-toggle [formControl]="mockHolidays" testid="tgl-mock-holidays"
        >Use testid
      </mat-slide-toggle>
    </p> `,
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule, TestidDirective],
})
export class HomeComponent implements OnInit {
  config = inject(Configuration);
  formGroup = inject(NonNullableFormBuilder).group({
    mockCustomers: [true],
    mockHolidays: [true],
    useTestid: [true],
  });

  mockCustomers = new FormControl(true, {
    nonNullable: true,
  });

  mockHolidays = new FormControl(true, {
    nonNullable: true,
  });

  useDataTestid = new FormControl(true, {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.mockCustomers.valueChanges.subscribe(
      (mockCustomers) => (this.config.mockCustomers = mockCustomers)
    );

    this.mockHolidays.valueChanges.subscribe(
      (mockHolidays) => (this.config.mockHolidays = mockHolidays)
    );

    this.useDataTestid.valueChanges.subscribe(
      (useTestid) => (this.config.useTestid = useTestid)
    );
  }
}
