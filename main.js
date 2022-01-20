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

assetManager.queueDownload("./resources/shepherd.png")
assetManager.queueDownload("./resources/No Worries.mp3")
assetManager.queueDownload("./resources/Kevin MacLeod - Pixelland.mp3")
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

	const volumeSlider = document.getElementById("volume-slider");
	const backgroundMusic = assetManager.getAsset("./resources/No Worries.mp3");
	backgroundMusic.loop = true;
	volumeSlider.addEventListener("change", event => {
		const newVolume = event.target.value;
		backgroundMusic.volume = newVolume;
		backgroundMusic.play();
	});
	backgroundMusic.volume = volumeSlider.value;
	const autoPlayID = setInterval(() => {
		backgroundMusic.play()
			.then(() => clearInterval(autoPlayID))
			.catch(console.error);
	}, 500);

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

const alignmentInput = document.getElementById("alignment");
const cohesionInput = document.getElementById("cohesion");
const separationInput = document.getElementById("separation");

alignmentInput.value = params.sheep.alignmentFactor;
cohesionInput.value = params.sheep.cohesionFactor;
separationInput.value = params.sheep.separationFactor;

alignmentInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		alignmentInput.value = value;
	}
	params.sheep.alignmentFactor = value;
});
cohesionInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		cohesionInput.value = value;
	}
	params.sheep.cohesionFactor = value;
});
separationInput.addEventListener("change", event => {
	let { value } = event.target;
	if (value < 1) {
		value = 1;
		separationInput.value = value;
	}
	params.sheep.separationFactor = value;
});

const resetFactors = () => {
	separationInput.value = params.sheep.separationFactor = 18;
	cohesionInput.value = params.sheep.cohesionFactor = 10;
	alignmentInput.value = params.sheep.alignmentFactor = 300;
};