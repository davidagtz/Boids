class CircleBoundary {
	type = "circle";

	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}

	intersects(b) {
		if (b.type === "circle") {
			const sum = this.r + bound.r;
			const d = Math.hypot(this.x - b.x, this.y - b.y);
			return d <= sum;
		} else if (b.type === "rect") {
			const dx = Math.abs(this.x - (b.width / 2 + b.x));
			const dy = Math.abs(this.y - (b.height / 2 + b.y));

			if (dx > this.r + b.width / 2) return false;
			if (dy > this.r + b.height / 2) return false;

			if (dx <= b.width / 2) return true;
			if (dy <= b.height / 2) return true;

			const dist = Math.hypot(dx - b.width / 2, dy - b.height / 2);

			return dist <= this.r;
		}
		return false;
	}

	contains(p) {
		return Math.hypot(p.x - this.x, p.y - this.y) <= this.r;
	}
}

class RectangleBoundary {
	type = "rect";

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	intersects(b) {
		if (b.type === "circle") {
			return b.intersects(this);
		} else if (b.type === "rect") {
			if (
				this.x + this.width < b.x ||
				b.x + b.width < this.x ||
				this.y + this.height < b.y ||
				b.y + b.height < this.y
			)
				return false;

			return true;
		}

		return false;
	}

	contains(p) {
		return (
			p.x <= this.x + this.width &&
			p.x >= this.x &&
			p.y >= this.y &&
			p.y <= this.y + this.height
		);
	}
}

class QuadTree {
	constructor(boundary, capacity = 4) {
		// Max in each division
		this.capacity = capacity;

		// Boundary
		this.boundary = boundary;

		// Named after their quadrants
		this.one = null;
		this.two = null;
		this.three = null;
		this.four = null;

		// To see if to check quadrants
		this.divided = false;

		this.points = [];
	}

	find(boundary, points = []) {
		if (!this.boundary.intersects(boundary)) return;

		for (let i = 0; i < this.points.length; i++) {
			if (this.boundary.contains(this.points[i]))
				points.push(this.points[i]);
		}

		if (this.divided) {
			this.one.find(boundary, points);
			this.two.find(boundary, points);
			this.three.find(boundary, points);
			this.four.find(boundary, points);
		}

		return points;
	}

	add(p) {
		if (!this.boundary.contains(p)) return false;

		if (this.points.length < this.capacity) {
			this.points.push(p);
			return true;
		}

		if (!this.divided) this.divide();

		return (
			this.one.add(p) ||
			this.two.add(p) ||
			this.three.add(p) ||
			this.four.add(p)
		);
	}

	divide() {
		const x = this.boundary.x;
		const y = this.boundary.y;
		const width = this.boundary.width;
		const height = this.boundary.height;

		const one = new RectangleBoundary(
			width / 2 + x,
			y,
			width / 2,
			height / 2
		);
		this.one = new QuadTree(one, this.capacity);

		const two = new RectangleBoundary(x, y, width / 2, height / 2);
		this.two = new QuadTree(two, this.capacity);

		const three = new RectangleBoundary(
			x,
			height / 2 + y,
			width / 2,
			height / 2
		);
		this.three = new QuadTree(three, this.capacity);

		const four = new RectangleBoundary(
			width / 2 + x,
			height / 2 + y,
			width / 2,
			height / 2
		);
		this.four = new QuadTree(four, this.capacity);

		this.divided = true;
	}
}
