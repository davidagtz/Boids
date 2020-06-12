let quad, boids;

function setup() {
	createCanvas(800, 600);
	quad = new QuadTree(new RectangleBoundary(0, 0, width, height));

	boids = [];
	for (let i = 0; i < 200; i++) {
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
