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

	const cameraTarget = new class Target {
		constructor(x = 100, y = 100) {
			this.x = x;
			this.y = y;
		}

		update(gameEngine) {
			if (gameEngine.rightclick) {
				this.x += gameEngine.rightclick.x - gameEngine.width / 2;
				this.y += gameEngine.rightclick.y - gameEngine.height / 2;
				gameEngine.rightclick = null;
			}
			if (gameEngine.keys.d) this.x += 8;
			if (gameEngine.keys.a) this.x -= 8;
			if (gameEngine.keys.w) this.y -= 8;
			if (gameEngine.keys.s) this.y += 8;
		}

		draw(ctx, gameEngine) { }
	}(gameEngine.width / 2, gameEngine.height / 2);

	const camera =
		new Camera(gameEngine.width / 2, gameEngine.height / 2, cameraTarget);
	gameEngine.setCamera(camera);
	gameEngine.addEntity(cameraTarget);
	gameEngine.start();
});

const toggleWorldBorder = () =>
	gameEngine.options.hasWorldBorder = !gameEngine.options.hasWorldBorder;

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });