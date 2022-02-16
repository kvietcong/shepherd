const setupEnvironment = entities => {
	//starting area collision boxes
	//west
	entities.push(new Obstacle(950, 550, "./resources/3.png", 50, 50, 15, 200, 5));
	//north
	entities.push(new Obstacle(950, 550, "./resources/3.png", 50, 50, 400, 15, 5));
	//east
	entities.push(new Obstacle(2880, 550, "./resources/3.png", 50, 50, 15, 200, 5));
	//there are two southern collision boxes to allow for an opening
	//south west
	entities.push(new Obstacle(950, 1480, "./resources/3.png", 50, 50, 150, 15, 5));
	//south east
	entities.push(new Obstacle(2200, 1480, "./resources/3.png", 50, 50, 150, 15, 5));

	//first walkway collision boxes
	//west
	entities.push(new Obstacle(1650, 1500, "./resources/3.png", 50, 50, 15, 220, 5));
	//east
	entities.push(new Obstacle(2200, 1500, "./resources/3.png", 50, 50, 15, 140, 5));
	//south
	entities.push(new Obstacle(1650, 2600, "./resources/3.png", 50, 50, 423, 15, 5));
	//north
	entities.push(new Obstacle(2200, 2140, "./resources/3.png", 50, 50, 312, 15, 5));

	//main area collision boxes
	//south
	entities.push(new Obstacle(3700, 2700, "./resources/3.png", 50, 50, 495, 15, 5));
	//west
	entities.push(new Obstacle(3675, 500, "./resources/3.png", 50, 50, 15, 342, 5));
	//north
	entities.push(new Obstacle(3675, 480, "./resources/3.png", 50, 50, 890, 15, 5));
	//east
	entities.push(new Obstacle(6090, 1100, "./resources/3.png", 50, 50, 15, 342, 5));

	//forest map obstacles/decorations
	//starting area
	//big tree in the west
	entities.push(new Obstacle(100, 230, "./resources/big_tree.png", 0, 0, 281, 255, 3));
	//well in the starting area
	entities.push(new Obstacle(2500, 900, "./resources/starDewBuildings.png", 453, 33, 47, 74, 2));
	//water surrounding well
	entities.push(new Obstacle(2250, 630, "./resources/forestwater.png", 0, 0, 319, 319, 2));

	//first walkway area
	//rocks
	entities.push(new Obstacle(2000, 2100, "./resources/2.png", 0, 0, 43, 38, 2));
	entities.push(new Obstacle(1850, 1700, "./resources/1.png", 0, 0, 43, 38, 2));
	//tree stump in the west
	entities.push(new Obstacle(950, 2000, "./resources/treetrunk.png", 0, 0, 143, 122, 3));

	//main area
	//tree stump in the south east
	entities.push(new Obstacle(5675, 2350, "./resources/treetrunk.png", 0, 0, 143, 122, 3));
	//north west houses
	entities.push(new Obstacle(3900, 500, "./resources/starDewBuildings.png", 0, 267, 456, 145, 2.5));

	//ending/barn area
	//barn
	entities.push(new Obstacle(7500, 1200, "./resources/starDewBuildings.png", 130, 0, 111, 105, 3));
	//silo
	entities.push(new Obstacle(7800, 1130, "./resources/starDewBuildings.png", 390, 0, 47, 127, 3));
	//green house
	entities.push(new Obstacle(6200, 1900, "./resources/starDewBuildings.png", 483, 241, 111, 159, 3));


	/*
	//sample obstacles
	let house2 = new Obstacle(387, 380, "./resources/3.png");
	entities.push(house2);
	entities.push(new Obstacle(290, 860, "./resources/2.png"));
	entities.push(new Obstacle(773, 577, "./resources/1.png"));
	//barn
	entities.push(new Obstacle(570, 1100, "./resources/starDewBuildings.png", 130, 0, 111, 105, 2));
	//silo
	entities.push(new Obstacle(540, 1077, "./resources/starDewBuildings.png", 390, 0, 47, 127, 1));
	//well
	entities.push(new Obstacle(600, 1000, "./resources/starDewBuildings.png", 453, 33, 47, 74, 1));
	//bridge posts
	entities.push(new Obstacle(670, 775, "./resources/Map_tiles.png", 289, 252, 4, 40, 2.5));
	entities.push(new Obstacle(958, 775, "./resources/Map_tiles.png", 289, 252, 4, 40, 2.5));
	*/
	//new image object for tile set
	let idk = new Image(96, 96);
	idk.src = "./resources/Map_tiles.png";

	let forestSourceImage = new Image(629, 679);
	forestSourceImage.src = "./resources/forestground.png";

	let forestWaterImage = new Image(410, 331);
	forestWaterImage.src = "./resources/forestwater.png";

	//new tile object
	let grassTile = {
		x: 97,
		y: 1,
		width: 79,
		image: idk
	}
	let grassTileEdge = {
		x: 97,
		y: 1,
		width: 90,
		image: idk
	}
	let waterTile = {
		x: 0,
		y: 0,
		width: 96,
		image: idk
	}
	let lightGrassTile = {
		x: 289,
		y: 1,
		width: 79,
		image: idk
	}
	let lightGrassTileEdge = {
		x: 289,
		y: 1,
		width: 90,
		image: idk
	}
	let woodTile = {
		x: 294,
		y: 335,
		width: 14,
		image: idk
	}
	let forestMudTile = {
		x: 286,
		y: 512,
		width: 31,
		image: forestSourceImage
	}
	let forestFlowerTile = {
		x: 96,
		y: 480,
		width: 31,
		image: forestSourceImage
	}
	let forestTile = {
		x: 64,
		y: 0,
		width: 32,
		image: forestWaterImage
	}
	let rockTile = {
		x: 162,
		y: 590,
		width: 40,
		image: forestSourceImage
	}
	let vrockTile = {
		x: 46,
		y: 480,
		width: 40,
		image: forestSourceImage
	}
	let darkWaterTile = {
		x: 190,
		y: 105,
		width: 32,
		image: forestWaterImage
	}
	let startWaterTile = {
		x: 0,
		y: 160,
		width: 32,
		image: forestWaterImage
	}
	let waterRockTile = {
		x: 321,
		y: 193,
		width: 32,
		image: forestWaterImage
	}

	//assemble tileData array
	let tileData = [];
	tileData["default"] = grassTile;
	tileData["grassEdge"] = grassTileEdge;
	tileData["lightGrass"] = lightGrassTile;
	tileData["lightGrassEdge"] = lightGrassTileEdge;
	tileData["water"] = waterTile;
	tileData["wood"] = woodTile;
	tileData["forest"] = forestTile;
	tileData["forestFlower"] = forestFlowerTile;
	tileData["forestMud"] = forestMudTile;
	tileData["rock"] = rockTile;
	tileData["vrock"] = vrockTile;
	tileData["dwater"] = darkWaterTile;
	tileData["swater"] = startWaterTile;
	tileData["rwater"] = waterRockTile;

	//find tile size
	const tileWidth = 96;
	//tiles needed to cover the play area with current tile width
	let xTile = 25; //canvas.width*2 / tileWidth - 1;
	let yTile = 25; //canvas.height*2 / tileWidth;

	//current availble map types: "Test"-original map, "Forest"-currently under construction
	let importedMap = new Map("Forest");
	const mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	entities.push(mainEnvironment);

	//new background tileData
	//let backgroundTileData = [];
	//backgroundTileData["default"] = waterTile;
	//const backgroundEnvironment = new Environment(xTile, yTile, backgroundTileData, -2)
	//entities.push(backgroundEnvironment);

    return mainEnvironment;
};