const gameEngine = new GameEngine();
const assetManager = new AssetManager();

const resizeCanvas = canvas => {
	canvas.width = round(document.documentElement.clientWidth * 0.75);
	canvas.height = round(canvas.width / (16 / 9));
	return canvas;
};

const initializeCanvas = () => {
	const canvas = document.createElement("canvas");
	document.getElementById("canvas-container").appendChild(canvas);
	canvas.style.border = "1px solid black";
	canvas.style.background = "white";
	resizeCanvas(canvas);
	return canvas;
};

const canvas = initializeCanvas();

assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);

	const entities = [];
	for (let i = 0; i < 100; i++) {
		let x = randomInt(canvas.width * 2);
		let y = randomInt(canvas.height * 2);
		entities.push(new Sheep(x, y));
	}
	gameEngine.addEntities(entities);

	const camera = new Camera(gameEngine.width / 2, gameEngine.height / 2);
	gameEngine.setCamera(camera);
	gameEngine.start();
});

const toggleWorldBorder = () =>
	gameEngine.options.hasWorldBorder = !gameEngine.options.hasWorldBorder;

const resetTarget = () => gameEngine.camera
	.setPosition(gameEngine.width / 2, gameEngine.height / 2);

const resetZoom = () => gameEngine.camera.zoom = 1;

const resetCamera = () => { resetTarget(); resetZoom(); };

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });