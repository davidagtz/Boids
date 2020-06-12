class Boid {
	constructor(x, y, view, tree, velocity = null) {
		this.x = x;
		this.y = y;
		this.view = new CircleBoundary(x, y, view);

		if (!velocity) {
			this.velocity = p5.Vector.random2D();
			this.velocity.setMag(2);
		} else this.velocity = velocity;

		this._draw = {};
		this._draw.vec = this.velocity.copy().setMag(25);

		this._draw.ort = this._draw.vec.copy().rotate(Math.PI / 2);
		this._draw.ort.div(4);

		this.tree = tree;
	}

	draw(options = {}) {
		if (options.view) {
			noFill();
			stroke(0, 255, 0);
			if (options.scaleView)
				ellipse(this.x, this.y, this.view.r * options.scaleView);
			else ellipse(this.x, this.y, this.view.r);
		}

		noStroke();
		fill(255);
		triangle(
			this.x + this._draw.ort.x,
			this.y + this._draw.ort.y,
			this.x - this._draw.ort.x,
			this.y - this._draw.ort.y,
			this.x + this._draw.vec.x,
			this.y + this._draw.vec.y
		);

		// if (this._neighbors) {
		// 	fill(0, 255, 255);
		// 	ellipse(this.x, this.y, 10);
		// 	fill(255, 0, 0);
		// 	for (const neighbor of this._neighbors)
		// 		ellipse(neighbor.x, neighbor.y, 10);
		// }
	}

	update() {
		this.findNeighbors();

		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.x < 0) this.x = width;
		if (this.x > width) this.x = 0;
		if (this.y < 0) this.y = height;
		if (this.y > height) this.y = 0;

		this.view.x = this.x;
		this.view.y = this.y;
	}

	findNeighbors() {
		this._neighbors = this.tree.find(this.view, this);
	}
}
