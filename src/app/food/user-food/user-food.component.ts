import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FoodContainerComponent } from '../food-container/food-container.component';
import { FoodComponent } from '../food.component';
import { Food } from '../food.model';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-user-food',
  standalone: true,
  templateUrl: './user-food.component.html',
  styleUrls: ['./user-food.component.css'],
  imports: [FoodContainerComponent, FoodComponent],
})
export class UserFoodComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private foodService = inject(FoodService);
  private destroyRef = inject(DestroyRef);
  food = this.foodService.loadedUserFood;

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.foodService.loadUserFood().subscribe({
      error: (error: Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemoveFood(food: Food) {
    const subscription = this.foodService.removeUserFood(food).subscribe();

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
