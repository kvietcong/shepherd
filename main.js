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

const entities = [
	new Entity(200, 200, 100),
	new Entity(400, 400, 50),
	new Entity(600, 100, 150),
];
gameEngine.addEntities(entities);

assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });