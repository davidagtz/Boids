interface Point {
	x: number;
	y: number;
}

interface Boundary {
	x: number;
	y: number;
	type: "circle" | "rect";
	intersects: (b: Boundary) => boolean;
	contains: (p: Point) => boolean;
}

class CircleBoundary implements Boundary {
	x: number;
	y: number;
	r: number;
	type: "circle";

	constructor(x: number, y: number, r: number) {
		this.x = x;
		this.y = y;
		this.r = r;
	}

	intersects(b: Boundary) {
		if (b.type === "circle") {
			const bound = b as CircleBoundary;
			const sum = this.r + bound.r;
			const d = Math.hypot(this.x - bound.x, this.y - bound.y);
			return d <= sum;
		} else if (b.type === "rect") {
			const bound = b as RectangleBoundary;

			const dx = Math.abs(this.x - (bound.width / 2 + bound.x));
			const dy = Math.abs(this.y - (bound.height / 2 + bound.y));

			if (dx > this.r + bound.width / 2) return false;
			if (dy > this.r + bound.height / 2) return false;

			if (dx <= bound.width / 2) return true;
			if (dy <= bound.height / 2) return true;

			const dist = Math.hypot(
				dx - bound.width / 2,
				dy - bound.height / 2
			);

			return dist <= this.r;
		}
		return false;
	}

	contains(p: Point) {
		return Math.hypot(p.x - this.x, p.y - this.y) <= this.r;
	}
}

class RectangleBoundary implements Boundary {
	x: number;
	y: number;
	width: number;
	height: number;
	type: "rect";

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	intersects(b: Boundary) {
		if (b.type === "circle") {
			return b.intersects(this);
		} else if (b.type === "rect") {
			const bound = b as RectangleBoundary;

			if (
				this.x + this.width < bound.x ||
				bound.x + bound.width < this.x ||
				this.y + this.height < bound.y ||
				bound.y + bound.height < this.y
			)
				return false;

			return true;
		}

		return false;
	}

	contains(p: Point) {
		return (
			p.x <= this.x + this.width &&
			p.x >= this.x &&
			p.y >= this.y &&
			p.y <= this.y + this.height
		);
	}
}

class QuadTree {
	boundary: RectangleBoundary;
	capacity: number;
	divided: boolean;

	points: Point[];

	one: QuadTree | null;
	two: QuadTree | null;
	three: QuadTree | null;
	four: QuadTree | null;

	constructor(boundary: RectangleBoundary, capacity = 4) {
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

	find(boundary: Boundary, points = []) {
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

	add({ x, y }: Point) {
		if (!this.boundary.contains({ x, y })) return false;

		if (this.points.length < this.capacity) {
			this.points.push({ x, y });
			return true;
		}

		if (!this.divided) this.divide();

		return (
			this.one.add({ x, y }) ||
			this.two.add({ x, y }) ||
			this.three.add({ x, y }) ||
			this.four.add({ x, y })
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
