import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ItemComponent} from "../../../../../../items/item-list/item/item.component";
import {Order} from "../../../../../../shared/models/order.model";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    ItemComponent
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @ViewChild('carousel') carousel!: ElementRef;
  @Input() order!: Order;
  isDown: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;
  carouselDown(event: MouseEvent) {
    const slider = this.carousel.nativeElement;
    this.isDown = true;
    slider.classList.add('active');
    this.startX = event.pageX - slider.offsetLeft;
    this.scrollLeft = slider.scrollLeft;
  }

  carouselLeave() {
    const slider = this.carousel.nativeElement;
    this.isDown = false;
    slider.classList.remove('active');
  }

  carouselUp() {
    const slider = this.carousel.nativeElement;
    this.isDown = false;
    slider.classList.remove('active');
  }

  carouselMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const slider = this.carousel.nativeElement;
    const x = event.pageX - slider.offsetLeft;
    const SCROLL_SPEED = 3;
    const walk = (x - this.startX) * SCROLL_SPEED;
    slider.scrollLeft = this.scrollLeft - walk;
  }
}
