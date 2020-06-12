class Boid {
	constructor(x, y, view, tree, velocity = null) {
		this.x = x;
		this.y = y;
		this.view = new CircleBoundary(x, y, view);

		if (!velocity) {
			this.velocity = p5.Vector.random2D();
			this.velocity.setMag(2);
		} else this.velocity = velocity;

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

		const vec = this.velocity.copy().setMag(25);
		const ort = vec.copy().rotate(Math.PI / 2);
		ort.div(4);

		noStroke();
		fill(255);
		triangle(
			this.x + ort.x,
			this.y + ort.y,
			this.x - ort.x,
			this.y - ort.y,
			this.x + vec.x,
			this.y + vec.y
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
		this.x += this.velocity.x;
		this.y += this.velocity.y;

		if (this.x < 0) {
			this.x = 0;
			this.velocity.x *= -1;
		} else if (this.x > width) {
			this.x = width;
			this.velocity.x *= -1;
		}
		if (this.y < 0) {
			this.y = 0;
			this.velocity.y *= -1;
		} else if (this.y > height) {
			this.y = height;
			this.velocity.y *= -1;
		}

		this.view.x = this.x;
		this.view.y = this.y;

		this.findNeighbors();
		this._acc = new p5.Vector();
		this.align();
		this.avoid();
		this._acc.limit(0.25);

		this.velocity.x += this._acc.x;
		this.velocity.y += this._acc.y;
		this.velocity.limit(3);
		if (this.velocity.mag() < 2) this.velocity.setMag(2);
	}

	avoid() {
		const acc = new p5.Vector();

		for (const n of this._neighbors) {
			const to = createVector(this.x - n.x, this.y - n.y);
			to.setMag(this.view.r / to.mag());
			acc.add(to);
		}

		// acc.limit(2);
		this._acc.add(acc);
	}

	align() {
		const acc = new p5.Vector();

		for (const n of this._neighbors) {
			acc.add(n.velocity);
		}
		if (this._neighbors.length !== 0) {
			acc.div(this._neighbors.length);

			// Finding the orthongal correction
			let c = this.velocity.dot(this.velocity);
			c /= acc.dot(this.velocity);
			acc.mult(c);

			acc.sub(this.velocity);

			this._acc.add(acc);
		}
	}

	findNeighbors() {
		this._neighbors = this.tree.find(this.view, this);
	}
}
