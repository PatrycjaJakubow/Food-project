import { Component, input } from '@angular/core';

@Component({
  selector: 'app-food-container',
  standalone: true,
  imports: [],
  templateUrl: './food-container.component.html',
  styleUrl: './food-container.component.css'
})
export class FoodContainerComponent {
  title = input.required<string>();
}
