import {AfterViewInit, ElementRef, ViewChild, Component} from '@angular/core';
import { Application, Container, Sprite, Assets, Texture } from 'pixi.js';


interface Pin {
  id: string;
  x: number; // 0–1
  y: number; // 0–1
  title?: string;
}

@Component({
  selector: 'app-map-canvas-pixi',
  templateUrl: './map-canvas-pixi.component.html',
  styleUrls: ['./map-canvas-pixi.component.scss']
})
export class MapCanvasPixiComponent implements AfterViewInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;

  pixiApp!: Application;


  async ngAfterViewInit() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight - 112;
    this.pixiApp = new Application({
      width,
      height,
    });

    this.pixiContainer.nativeElement.appendChild(this.pixiApp.view);
    // @ts-ignore actually, it waits for Node, but NOT for ICanvas, okay
    // will be fixed later


    await this.addBackground();

    this.bunnyTexture =  await Assets.load('https://pixijs.com/assets/bunny.png');
    const ilyxa = new Sprite(this.bunnyTexture);
    const lexa = new Sprite(this.bunnyTexture);
    ilyxa.anchor.set(0.5);
    console.log(this.pixiApp.screen.width, this.pixiApp.screen.height);
    ilyxa.x = this.pixiApp.screen.width / 2;
    ilyxa.y = this.pixiApp.screen.height / 2;
    lexa.x = 100;

    ilyxa.eventMode = 'static';
    ilyxa.cursor = 'pointer';

    ilyxa.on('pointerdown', () => {
      console.log('Bunny clicked!');
      // Add your custom logic here
    });
    this.pixiApp.stage.addChild(ilyxa);

  }

  async addBackground() {
    const texture = await Assets.load('/assets/maps/default.png');
    const background = new Sprite(texture);
    // Stretch to fill the screen
    background.width = this.pixiApp.screen.width;
    background.height = this.pixiApp.screen.height;
    // Add to stage first
    this.pixiApp.stage.addChild(background);
    background.eventMode = 'static';
    background.cursor = 'pointer';

    background.on('pointerdown', (event) => {
      const { x, y } = event.global;
      console.log('Background clicked at:', x, y);
      // Add your custom logic here
      this.addBunnyAt(x, y);
    });
  }

  private bunnyTexture?: Texture;
  addBunnyAt(x: number, y: number) {
    if (!this.bunnyTexture) return;
    console.log('Bunny at:', x, y);
    const bunny = new Sprite(this.bunnyTexture);
    bunny.anchor.set(0.5);
    bunny.x = x;
    bunny.y = y;
    bunny.eventMode = 'static';
    bunny.cursor = 'pointer';
    bunny.on('pointerdown', () => {
      console.log('Bunny clicked!');
    });
    this.pixiApp.stage.addChild(bunny);
  }
}
