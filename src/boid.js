class Boid {
	constructor(x, y, view) {
		this.x = x;
		this.y = y;
		this.view = view;
	}

	draw() {
		ellipse(this.x, this.y, 10);
	}
}
