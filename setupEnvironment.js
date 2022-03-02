const setupEnvironment = entities => {
	//current availble map types: "Test"-original map, "Forest"-finished, "levelTwo" - under construction
	//create Map object with the specified level
	let importedMap = new Map("Forest");

	let mainEnvironment;

	if(importedMap.mapType == "Forest" || importedMap.mapType == "Test"){
		//starting area collision boxes
		//west
		//starting area collision boxes
		//west
		entities.push(new Obstacle(970, 550, "./resources/3.png", 50, 50, 15, 200, 5));
		//north
		entities.push(new Obstacle(950, 490, "./resources/3.png", 50, 50, 400, 15, 5));
		//east
		entities.push(new Obstacle(2880, 550, "./resources/3.png", 50, 50, 15, 200, 5));
		//there are two southern collision boxes to allow for an opening
		//south west
		entities.push(new Obstacle(950, 1480, "./resources/3.png", 50, 50, 150, 15, 5));
		//south east
		entities.push(new Obstacle(2200, 1480, "./resources/3.png", 50, 50, 150, 15, 5));

		//first walkway collision boxes
		//west
		entities.push(new Obstacle(1650, 1500, "./resources/3.png", 50, 50, 15, 250, 5));
		//east
		entities.push(new Obstacle(2200, 1500, "./resources/3.png", 50, 50, 15, 140, 5));
		//lowersouth
		entities.push(new Obstacle(1650, 2700, "./resources/3.png", 50, 50, 423, 15, 5));
		//uppersouth
		entities.push(new Obstacle(2225, 2600, "./resources/3.png", 50, 50, 306, 20, 5));
		//lowernorth
		entities.push(new Obstacle(2200, 2140, "./resources/3.png", 50, 50, 312, 15, 5));

		//main area collision boxes
		//south
		entities.push(new Obstacle(3700, 2700, "./resources/3.png", 50, 50, 495, 15, 5));
		//west
		entities.push(new Obstacle(3675, 500, "./resources/3.png", 50, 50, 15, 342, 5));
		//north
		entities.push(new Obstacle(3675, 480, "./resources/3.png", 50, 50, 890, 15, 5));
		//east
		entities.push(new Obstacle(4640, 1350, "./resources/3.png", 50, 50, 15, 270, 5));
		//east 2
		entities.push(new Obstacle(6090, 550, "./resources/3.png", 50, 50, 15, 390, 5));

		//forest map obstacles/decorations
		//starting area
		//big tree in the west
		entities.push(new Obstacle(100, 230, "./resources/big_tree.png", 0, 0, 281, 255, 3));
		//water surrounding well
		entities.push(new Obstacle(2250, 630, "./resources/forestwater.png", 0, 0, 319, 319, 2));
		//well in the starting area
		const well = new Obstacle(2500, 900, "./resources/starDewBuildings.png", 453, 33, 47, 74, 2);
		well.z = 1;
		entities.push(well);
		//trees
		entities.push(new Tree(1200, 1000));
		entities.push(new Tree(1300, 1000));
		entities.push(new Tree(1400, 900));
		entities.push(new Tree(1450, 900));
		entities.push(new Tree(1500, 900));
		entities.push(new Tree(1900, 700));
		entities.push(new Tree(2000, 700));
		entities.push(new Tree(1550, 1300));
		entities.push(new Tree(1600, 1300));
		entities.push(new Tree(1650, 1300));

		//first walkway area
		//rocks
		entities.push(new Obstacle(2000, 2100, "./resources/2.png", 0, 0, 43, 38, 2, 43 * 2, 45, true));
		entities.push(new Obstacle(1850, 1700, "./resources/1.png", 0, 0, 43, 38, 2, 43 * 1.25, 40, true));
		//tree stump in the west
		entities.push(new Obstacle(950, 2000, "./resources/treetrunk.png", 0, 0, 143, 122, 3));

		//main area
		//north west houses
		entities.push(new Obstacle(3900, 500, "./resources/starDewBuildings.png", 0, 267, 456, 145, 2.5));
		//long grass
		entities.push(new Obstacle(4650, 1260, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(4650, 1176, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(4650, 1092, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(4650, 1008, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(4650, 924, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));

		//rocks
		//type 1
		entities.push(new Obstacle(3800, 1800, "./resources/forestground.png", 514, 25, 32, 37, 1.5));
		entities.push(new Obstacle(4400, 1950, "./resources/forestground.png", 514, 25, 32, 37, 1.5));
		//type 2
		entities.push(new Obstacle(4100, 2000, "./resources/forestground.png", 450, 36, 33, 25, 1.5));
		entities.push(new Obstacle(3900, 2200, "./resources/forestground.png", 450, 36, 33, 25, 1.5));
		//type 3
		entities.push(new Obstacle(4150, 2170, "./resources/forestground.png", 518, 90, 31, 35, 1.5));
		//trees
		entities.push(new Tree(4400, 2400));
		entities.push(new Tree(4500, 2200));

		//ending/barn area
		//barn
		entities.push(new Barn(5470, 1550, "./resources/starDewBuildings.png", 130, 0, 111, 105, 3, 10));
		//silo
		entities.push(new Obstacle(5800, 1530, "./resources/starDewBuildings.png", 390, 0, 47, 127, 3));
		//tree stump in the south east
		entities.push(new Obstacle(5675, 2450, "./resources/treetrunk.png", 0, 0, 143, 122, 3, 400, 250));

		//east of ending area
		//north east garden
		entities.push(new Obstacle(6200, 600, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6200, 700, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6200, 800, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6200, 900, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6400, 600, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6400, 700, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6400, 800, "./resources/plants.png", 132, 149, 55, 43, 2));
		entities.push(new Obstacle(6400, 900, "./resources/plants.png", 132, 149, 55, 43, 2));
		//green house
		entities.push(new Obstacle(6200, 1900, "./resources/starDewBuildings.png", 483, 241, 111, 159, 3));
		//plants surrounding green house
		entities.push(new Obstacle(6200, 1500, "./resources/plants.png", 15, 13, 55, 55, 2));

		//create tile types
		let idk = new Image(96, 96);
		idk.src = "./resources/Map_tiles.png";

		let forestSourceImage = new Image(629, 679);
		forestSourceImage.src = "./resources/forestground.png";

		let forestWaterImage = new Image(410, 331);
		forestWaterImage.src = "./resources/forestwater.png";

		let woodImage = new Image(512, 512);
		woodImage.src = "./resources/mineWood.png";

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
			x: 0,
			y: 0,
			width: 512,
			image: woodImage
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
		let northShoreTile = {
			x: 223,
			y: 32,
			width: 32,
			image: forestWaterImage
		}
		let cornerWaterTile = {
			x: 32,
			y: 64,
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
		tileData["nwater"]= northShoreTile;
		tileData["cwater"]= cornerWaterTile;


		//tiles needed to cover the play area with current tile width - no longer used to determine size of map
		let xTile = 25; //canvas.width*2 / tileWidth - 1;
		let yTile = 25; //canvas.height*2 / tileWidth;
		mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	}

	if(importedMap.mapType == "levelTwo"){

		//obstacles
		entities.push(new Obstacle(700, 230, "./resources/big_tree.png", 0, 0, 281, 255, 3));

		let tx = new Image(256, 256);
		tx.src = "./resources/TX Tileset Grass.png";

		let txStone = new Image(256, 256);
		txStone.src = "./resources/TX Tileset Stone Ground.png";
		//new tiles for a new map
		let grassTx = {
			x: 0,
			y: 0,
			width: 256,
			image: tx
		}
		let stoneTx = {
			x: 0,
			y: 0,
			width: 256,
			image: txStone
		}
		let tileData = [];
		tileData["default"] = grassTx;
		tileData["g"] = grassTx;
		tileData["s"] = stoneTx;

		//tiles needed to cover the play area with current tile width - no longer used to determine size of map
		let xTile = 25; //canvas.width*2 / tileWidth - 1;
		let yTile = 25; //canvas.height*2 / tileWidth;
		mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	}



	/*
	let importedMap = new Map("Forest");
	const mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	*/

	//const mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	entities.push(mainEnvironment);

	//new background tileData
	//let backgroundTileData = [];
	//backgroundTileData["default"] = waterTile;
	//const backgroundEnvironment = new Environment(xTile, yTile, backgroundTileData, -2)
	//entities.push(backgroundEnvironment);

    return mainEnvironment;
};