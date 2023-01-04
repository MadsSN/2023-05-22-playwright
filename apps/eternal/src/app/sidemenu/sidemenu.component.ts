import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SecurityService } from '@eternal/shared/security';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'eternal-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [MatButtonModule, RouterLink, AsyncPipe, NgIf],
})
export class SidemenuComponent {
  #securityService = inject(SecurityService);
  loaded$ = this.#securityService.getLoaded$();
  signedIn$ = this.#securityService.getSignedIn$();
}
