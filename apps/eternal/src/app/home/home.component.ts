import { Component, NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Configuration } from '@eternal/shared/config';

@Component({
  selector: 'eternal-home',
  templateUrl: `./home.component.html`,
})
export class HomeComponent {
  mockCustomers = new FormControl(true);
  mockHolidays = new FormControl(true);

  constructor(private config: Configuration) {
    this.mockCustomers.valueChanges.subscribe((mockCustomers) =>
      config.setMockCustomers(mockCustomers)
    );
    this.mockHolidays.valueChanges.subscribe((mockHolidays) =>
      config.setMockHolidays(mockHolidays)
    );
  }
}

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [MatSlideToggleModule, ReactiveFormsModule],
})
export class HomeComponentModule {}
