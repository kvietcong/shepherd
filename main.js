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

const entities = [];
for (let i = 0; i < 20; i++) {
	let x = randomInt(canvas.width);
	let y = randomInt(canvas.height);
	console.log(x, y)
	entities.push(new Sheep(x, y));
}
gameEngine.addEntities(entities);

assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.start();
});

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });