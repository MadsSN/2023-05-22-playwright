import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Customer } from '@eternal/customers/model';
import { Options } from '@eternal/shared/form';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formly } from 'ngx-formly-helpers';

@Component({
  selector: 'eternal-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  formGroup = new FormGroup({});
  @Input() customer: Customer | undefined;
  @Input() countries: Options = [];
  @Input() showDeleteButton = true;
  @Input() disableSubmitButton = false;
  @Output() save = new EventEmitter<Customer>();
  @Output() remove = new EventEmitter<Customer>();
  fields: FormlyFieldConfig[] = [];

  ngOnInit() {
    console.log(this.countries);
    const country = formly.requiredSelect('country', 'Country');
    country.templateOptions = {
      attributes: { 'data-testid': 'inp-country' },
      options: this.countries,
    };

    this.fields = [
      formly.requiredText('firstname', 'Firstname', {
        attributes: { 'data-testid': 'inp-firstname' },
      }),
      formly.requiredText('name', 'Name', {
        attributes: { 'data-testid': 'inp-lastname' },
      }),
      country,
      formly.requiredDate('birthdate', 'Birthdate', {
        attributes: { 'data-testid': 'inp-birthdate' },
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
