import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Customer } from '@eternal/customers/model';
import { Options } from '@eternal/shared/form';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';
import { MatButtonModule } from '@angular/material/button';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { TestidDirective } from '../../../../../shared/ui/src/lib/testid.directive';

@Component({
  selector: 'eternal-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    FormlyModule,
    FormlyMatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink,
    NgIf,
    TestidDirective,
  ],
})
export class CustomerComponent implements OnInit {
  formGroup = new UntypedFormGroup({});
  @Input() customer: Customer | undefined;
  @Input() countries: Options = [];
  @Input() showDeleteButton = true;
  @Output() save = new EventEmitter<Customer>();
  @Output() remove = new EventEmitter<Customer>();
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    this.fields = [
      formly.requiredText('firstname', 'Firstname', {
        attributes: { testid: 'inp-firstname' },
      }),
      formly.requiredText('name', 'Name', {
        attributes: { testid: 'inp-lastname' },
      }),
      formly.requiredSelect('country', 'Country', this.countries, {
        attributes: { testid: 'inp-country' },
      }),
      formly.requiredDate('birthdate', 'Birthdate', {
        attributes: { testid: 'inp-birthdate' },
      }),
    ];
  }

  submit() {
    if (this.formGroup.valid) {
      this.save.emit(this.formGroup.value);
    }
  }

  handleRemove() {
    if (this.customer && confirm(`Really delete ${this.customer}?`)) {
      this.remove.emit(this.customer);
    }
  }
}
