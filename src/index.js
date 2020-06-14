let quad, boids;
let checkbox;
let showTree = false,
	isBounded = false;

function setup() {
	const controls = document.getElementById("controls");
	const bounded = createCheckbox("Bounded Box", isBounded);
	bounded.parent(controls);
	bounded.class("control");
	bounded.changed(function() {
		isBounded = this.checked();
	});

	const show = createCheckbox("Show QuadTree", showTree);
	show.parent(controls);
	show.class("control");
	show.changed(function() {
		showTree = this.checked();
	});

	const parent = document.getElementById("canvas-body");
	const cnv = createCanvas(0, 0);
	cnv.parent(parent);
	cnv.resize(parent.clientWidth, parent.clientHeight);

	quad = new QuadTree(new RectangleBoundary(0, 0, width, height));

	boids = [];
	for (let i = 0; i < 500; i++) {
		boids.push(new Boid(random(width), random(height), 50, quad));
	}
}

function draw() {
	background(0);

	quad.clear();
	for (boid of boids) {
		if (!quad.add(boid)) console.log("WHAT");
	}

	if (showTree) {
		quad.draw();
	}

	fill(255);
	for (boid of boids) {
		boid.draw();

		boid.update({
			bounded: isBounded
		});
	}
}
