import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivateComponent } from './activate/activate.component';
import { ActivateComponentModule } from './activate/activate.component.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignUpComponentModule } from './sign-up/sign-up.component.module';

@NgModule({
  imports: [
    ActivateComponentModule,
    SignUpComponentModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          { path: 'sign-up', component: SignUpComponent },
          { path: 'activate/:id', component: ActivateComponent },
        ],
      },
    ]),
  ],
})
export class UserModule {}
