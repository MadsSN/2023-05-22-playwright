import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  MatLegacySlideToggleChange as MatSlideToggleChange,
  MatLegacySlideToggleModule as MatSlideToggleModule,
} from '@angular/material/legacy-slide-toggle';
import { MatLegacyTableDataSource as MatTableDataSource, MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { Customer } from '@eternal/customers/model';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { CustomerPipe } from '../customer.pipe';
import { RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';

export interface CustomerWithSelected extends Customer {
  selected: boolean;
}
export interface CustomersViewModel {
  customers: CustomerWithSelected[];
  pageIndex: number;
  length: number;
}

@Component({
  selector: 'eternal-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    CustomerPipe,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule,
    RouterLink,
    NgIf,
    DatePipe,
  ],
})
export class CustomersComponent implements OnChanges {
  @Input() viewModel: CustomersViewModel | undefined;
  @Output() setSelected = new EventEmitter<number>();
  @Output() setUnselected = new EventEmitter<number>();
  @Output() switchPage = new EventEmitter<number>();

  displayedColumns = ['name', 'country', 'birthdate', 'action'];
  dataSource = new MatTableDataSource<CustomerWithSelected>([]);

  ngOnChanges(): void {
    if (this.viewModel) {
      this.dataSource.data = this.viewModel.customers;
    }
  }

  toggleSelection(toggleChange: MatSlideToggleChange, id: number) {
    if (toggleChange.checked) {
      this.setSelected.emit(id);
    } else {
      this.setUnselected.emit(id);
    }
  }
}
