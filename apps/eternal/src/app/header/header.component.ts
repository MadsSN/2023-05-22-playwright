import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SecurityService } from '@eternal/shared/security';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'eternal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatButtonModule, NgIf, AsyncPipe, RouterLink],
})
export class HeaderComponent {
  #securityService = inject(SecurityService);
  user$ = this.#securityService.loadedUser$;

  signOut() {
    this.#securityService.signOut();
  }

  signIn() {
    this.#securityService.signIn();
  }
}
