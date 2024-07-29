import { Component, inject } from '@angular/core';

import { AvailableFoodComponent } from './food/available-food/available-food.component';
import { UserFoodComponent } from './food/user-food/user-food.component';
import { ErrorService } from './shared/modal/error.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AvailableFoodComponent, UserFoodComponent, ErrorModalComponent],
})
export class AppComponent {
  private errorService = inject(ErrorService);
  error = this.errorService.error;
}
