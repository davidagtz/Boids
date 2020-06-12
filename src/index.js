let quad, boids;

function setup() {
	const body = document.getElementById("body");

	createCanvas(body.clientWidth, body.clientHeight);
	quad = new QuadTree(new RectangleBoundary(0, 0, width, height));

	boids = [];
	for (let i = 0; i < 1000; i++) {
		boids.push(new Boid(random(width), random(height), 50, quad));
	}

	boids[0].tree = quad;
}

function draw() {
	background(0);

	quad.clear();
	for (boid of boids) {
		if (!quad.add(boid)) console.log("WHAT");
	}

	fill(255);
	for (boid of boids) {
		boid.draw();

		boid.update();
	}
}
