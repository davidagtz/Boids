let quad, boids;

function setup() {
	createCanvas(800, 600);
	quad = new QuadTree(0, 0, width, height);
	boids = new Array(1).fill(0).map(e => new Boid(width / 2, height / 2, 100));
}

function draw() {
	background(0);

	fill(255);
	for (boid of boids) {
		boid.draw();
	}
}
