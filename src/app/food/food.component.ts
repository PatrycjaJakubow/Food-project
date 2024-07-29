import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Food } from './food.model';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MOCK_DESCRIPTIONS } from '../mock-descriptions';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css'],
})
export class FoodComponent {
  @Input() food: Food[] = [];
  @Input() buttonText: string = 'Add to Favourites';
  @Input() showDescription: boolean = false;
  @Output() selectFood = new EventEmitter<Food>();
  @Output() toggleFavourite = new EventEmitter<Food>();
  descriptions = MOCK_DESCRIPTIONS;

  hoveredFood: Food | null = null;
  foodItemDescription: string | null = null;

  onSelectFood(food: Food) {
    this.selectFood.emit(food);
  }

  onToggleFavourite(food: Food, event: Event) {
    event.stopPropagation(); 
    this.toggleFavourite.emit(food);
  }

  onMouseOver(food: Food) {
    this.hoveredFood = food;
    if (this.showDescription) {
      const description = this.descriptions.find(desc => desc.id === food.id);
      this.foodItemDescription = description ? description.description : null;
    } else {
      this.foodItemDescription = null;
    }
  }

  onMouseLeave() {
    this.hoveredFood = null;
    this.foodItemDescription = null;
  }

  trackById(index: number, item: Food) {
    return item.id;
  }
}

