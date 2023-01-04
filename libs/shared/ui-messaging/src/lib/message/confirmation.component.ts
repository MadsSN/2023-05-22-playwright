import { Component, inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

export interface ConfirmationData {
  message: string;
  deniable: boolean;
}

@Component({
  template: `<h1 mat-dialog-title>Confirm</h1>
    <div mat-dialog-content [innerHTML]="data.message"></div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>OK</button>
    </div>`,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmationComponent {
  dialogRef = inject(MatDialogRef<ConfirmationComponent>);
  data = inject(MAT_DIALOG_DATA);
}
