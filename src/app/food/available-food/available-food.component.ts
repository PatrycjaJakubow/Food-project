import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Food } from '../food.model';
import { FoodComponent } from '../food.component';
import { FoodContainerComponent } from '../food-container/food-container.component';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-available-food',
  standalone: true,
  templateUrl: './available-food.component.html',
  styleUrls: ['./available-food.component.css'],
  imports: [FoodComponent, FoodContainerComponent],
})
export class AvailableFoodComponent implements OnInit {
  food = signal<Food[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private foodService = inject(FoodService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription =
      this.foodService.loadAvailableFood().subscribe({
        next: (food) => {
          this.food.set(food);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onAddToFavourite(selectedFood: Food) {
    const subscription = this.foodService.addFoodToUserFood(selectedFood)
      .subscribe({
        next: (resData) => console.log(resData),
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
