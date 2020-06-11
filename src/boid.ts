import { Point } from "./quadtree";

class Boid implements Point {
	x: number;
	y: number;
	view: number;
	constructor(x: number, y: number, view: number) {
		this.x = x;
		this.y = y;
		this.view = view;
	}
}
