import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
  #userService = inject(SecurityService);
  user$ = this.#userService.getLoadedUser$();

  signOut() {
    this.#userService.signOut();
  }
}
