import { Component } from '@angular/core';
import { v4 as uuid } from 'uuid';

interface Pin {
  id: string;
  x: number; // 0–1
  y: number; // 0–1
  title?: string;
}

@Component({
  selector: 'app-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss']
})
export class MapCanvasComponent {
  pins: Pin[] = [];

  onMapClick(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    this.pins.push({ id: uuid(), x, y, title: 'New Note' });
  }

  openPin(pin: Pin, event: MouseEvent) {
    event.stopPropagation(); // prevent background click
    alert(`Opening pin: ${pin.title}`);
  }
}
