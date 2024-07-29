import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from './food.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/modal/error.service';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);
  private userFood = signal<Food[]>([]);

  loadedUserFood = this.userFood.asReadonly();

  loadAvailableFood() {
    return this.fetchFood('http://localhost:3000/food', 'Something went wrong');
  }
  loadUserFood() {
    return this.fetchFood('http://localhost:3000/user-food', 'Something went wrong')
    .pipe(tap({
      next: (userFood) => this.userFood.set(userFood),
    }));
  }

  addFoodToUserFood(food: Food) {

  const prevFood = this.userFood();
  if (!prevFood.some((p) => p.id === food.id)) {
    this.userFood.set([...prevFood, food]);
  }
  
  return this.httpClient.put('http://localhost:3000/user-food', {
    foodId: food.id,
  })
  .pipe(
    catchError(error => {
      this.userFood.set(prevFood);
      this.errorService.showError('Failed to store selected food.');
      return throwError(() => new Error('Failed to store selected food.'))
    })
  ); 
}

  removeUserFood(food: Food) {
    const prevFood = this.userFood();
    if (prevFood.some((p) => p.id === food.id )) {
      this.userFood.set(prevFood.filter(p => p.id !== food.id));
    }
    return this.httpClient.delete('http://localhost:3000/user-food/' + food.id)
    .pipe(
      catchError(error => {
        this.userFood.set(prevFood);
        this.errorService.showError('Failed to remove selected food.');
        return throwError(
          () => new Error('Failed to remove selected food.')
        );
  })
);
  }

  private fetchFood(url: string, errorMessage: string) {
    return this.httpClient
    .get<{ food: Food[] }>(url)
    .pipe(
      map((resData) => resData.food), 
      catchError((error) =>  { 
        console.log(error); 
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
