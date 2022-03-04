const gameEngine = new GameEngine();
const assetManager = new AssetManager();

const resizeCanvas = canvas => {
	const main = document.getElementsByTagName("main")[0];
	canvas.width = round(main.clientWidth * 0.65);
	canvas.height = round(canvas.width / (16 / 9));
	return canvas;
};

const initializeCanvas = () => {
	const canvas = document.createElement("canvas");
	document.getElementById("canvas-container").appendChild(canvas);
	canvas.style.border = "1px solid black";
	//canvas.style.background = "Green";
	canvas.style.background = "url('./resources/forestTile.png')";
	canvas.style.backgroundSize = "100%";
	canvas.autofocus = true;
	canvas.tabIndex = 0;
	resizeCanvas(canvas);
	return canvas;
};

const canvas = initializeCanvas();
const sceneManager = new SceneManager();
const inventory = new Inventory(10, 10, 5, 5, 1);
const darkness = new Darkness();

const gameOver = () => {
	return (Barn.sheepRequired - Barn.sheepCount) > Sheep.count;
}
const levelWon = () => {
	return (Barn.sheepRequired <= Barn.sheepCount);
}

assetManager.queueDownload("./resources/pixel_landscape_1.jpg");
assetManager.queueDownload("./resources/Play.png");
assetManager.queueDownload("./resources/wolf.png");
assetManager.queueDownload("./resources/shepherd.png")
assetManager.queueDownload("./resources/sheep.png")
assetManager.queueDownload("./resources/1.png");
assetManager.queueDownload("./resources/2.png");
assetManager.queueDownload("./resources/3.png");
assetManager.queueDownload("./resources/starDewBuildings.png");
assetManager.queueDownload("./resources/forestwater.png");
assetManager.queueDownload("./resources/big_tree.png");
assetManager.queueDownload("./resources/treetrunk.png");
assetManager.queueDownload("./resources/forestground.png");
assetManager.queueDownload("./resources/Map_tiles.png");
assetManager.queueDownload("./resources/plants.png");
assetManager.queueDownload("./resources/TX Tileset Grass.png");
assetManager.queueDownload("./resources/TX Tileset Stone Ground.png");
assetManager.queueDownload("./resources/TX Wall.png");
assetManager.queueDownload("./resources/TX Plant.png");
assetManager.queueDownload("./resources/TX Props.png");
assetManager.queueDownload("./resources/slash.png");
assetManager.queueDownload("./resources/fence_00.png");
assetManager.queueDownload("./resources/fence_vertical.png");
assetManager.queueDownload("./resources/fence_horizontal.png");
assetManager.queueDownload("./resources/fireicon.png");
assetManager.queueDownload("./resources/campfire.png");
assetManager.queueDownload("./resources/pinetree.png");
assetManager.queueDownload("./resources/just1Sheep.png");
assetManager.queueDownload("./resources/No Worries.mp3");
assetManager.queueDownload("./resources/Kevin MacLeod - Pixelland.mp3");
assetManager.queueDownload("./resources/sheep_baa.mp3");
assetManager.queueDownload("./resources/level_completed.png");
assetManager.queueDownload("./resources/coin.png");
assetManager.queueDownload("./resources/coin_01.png");
assetManager.queueDownload("./resources/campfire_2.png");
assetManager.queueDownload("./resources/campfire_3.png");
assetManager.queueDownload("./resources/game_over.png");
assetManager.queueDownload("./resources/play_again.png");
assetManager.queueDownload("./resources/logs.png");

assetManager.downloadAll(() => {
	const ctx = canvas.getContext("2d");
	gameEngine.init(ctx);
	gameEngine.addEntity(sceneManager);
	gameEngine.start();
});

// Event Hooks
window.addEventListener("resize", () => { resizeCanvas(canvas) });

const modifySheepFactor = (factor, change, cost = 1) => {
	const finalModification = params.sheep.modifications[factor] + change;
	if (abs(finalModification) > abs(params.sheep.modifications[factor])) {
		const successful = inventory.attemptSpend(cost, "modificationPoints");
		if (successful) params.sheep.modifications[factor] = finalModification;
		return successful;
	} else if (abs(finalModification) < abs(params.sheep.modifications[factor])) {
		inventory.modificationPoints += cost;
		params.sheep.modifications[factor] = finalModification;
		return true;
	}
	return false;
};

const modifySheepFactors = (changes, change) => {
	for (let i = 0; i < changes.length; i++) {
		const [factor, change] = changes[i];
		let cost = i === 0 ? 1 : 0;
		if (!modifySheepFactor(factor, change, cost)) return;
	}
}

const buyMods = (cost = 10) => {
	const successful = inventory.attemptSpend(cost);
	if (successful) inventory.modificationPoints += 1;
}

const debugInput = document.getElementById("debug");
debugInput.checked = params.isDebugging;
debugInput.addEventListener("change", event => {
	params.isDebugging = event.target.checked;
});

const pausePlay = () => gameEngine.isPaused = !gameEngine.isPaused;
const pausePlayButton = document.getElementById("pause-play");
setInterval(() => {
	const { isPaused } = gameEngine;
	pausePlayButton.innerText = `${isPaused ? "Play" : "Pause"} Game`;
}, 200);