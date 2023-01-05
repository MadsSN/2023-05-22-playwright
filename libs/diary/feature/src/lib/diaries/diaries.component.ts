import { Component } from '@angular/core';
import { TestidDirective } from '../../../../../shared/ui/src/lib/testid.directive';

@Component({
  selector: 'eternal-diaries',
  templateUrl: './diaries.component.html',
  styleUrls: ['./diaries.component.scss'],
  standalone: true,
  imports: [TestidDirective],
})
export class DiariesComponent {}
