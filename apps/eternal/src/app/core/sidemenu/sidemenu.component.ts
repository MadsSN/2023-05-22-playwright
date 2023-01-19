import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../../security/security.service';
import { TestidDirective } from '../../shared/testid.directive';

@Component({
  selector: 'eternal-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButtonModule, RouterLink, TestidDirective]
})
export class SidemenuComponent {
  securityService = inject(SecurityService);
}
