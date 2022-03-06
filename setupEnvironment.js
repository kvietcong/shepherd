const setupEnvironment = (entities, currMap) => {
	//current availble map types: "Test"-original map, "Forest"-finished, "levelTwo" - under construction
	//create Map object with the specified level
	let importedMap = new Map(currMap);

	let mainEnvironment;

	if(importedMap.mapType == "alpha" || importedMap.mapType == "preAlpha"){
        const shepherd = new Shepherd(1200, 1200);
        params.debugEntities.shepherd = shepherd;
        entities.push(shepherd);

        const startingArea = new SpawnPoint(1200, 650, 900, 750);
		entities.push(startingArea);
        startingArea.addToList(entities, Sheep, 20);

        const wolfPacks = [
            [new SpawnPoint(1830, 1830, 330, 200), 2], // rocks by first path
            [new SpawnPoint(2650, 2230, 500, 300), 4], // bridge over water
            [new SpawnPoint(3850, 950, 650, 1650), 6], // big open area after bridge
            [new SpawnPoint(5350, 1960, 650, 250), 3]  // small area by barn
        ];
        wolfPacks.forEach((info) => {
            const [spawnPoint, amount] = info;
			entities.push(spawnPoint);
            spawnPoint.addToList(entities, Wolf, amount);
        });

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
		entities.push(new Tree(1200, 1000, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1300, 1000, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1400, 900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1450, 900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1500, 900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1900, 700, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(2000, 700, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1550, 1300, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1600, 1300, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1650, 1300, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));

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
		entities.push(new Tree(4400, 2400, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(4500, 2200, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));

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

	if(importedMap.mapType == "levelOne"){
        const shepherd = new Shepherd(1000, 2200);
        params.debugEntities.shepherd = shepherd;
        entities.push(shepherd);

        const startingArea = new SpawnPoint(900, 2100, 200, 200);
        startingArea.addToList(entities, Sheep, 20);
		entities.push(startingArea);

        const wolfPacks = [
            [new SpawnPoint(2600, 1500, 330, 300), 3], // rocks by first path
            [new SpawnPoint(5650, 1500, 300, 300), 2], // bridge over water
            [new SpawnPoint(4650, 600, 330, 300), 2], // big open area after bridge
            [new SpawnPoint(2600, 800, 450, 350), 3]  // small area by barn
        ];

        wolfPacks.forEach((info) => {
            const [spawnPoint, amount] = info;
			entities.push(spawnPoint);
            spawnPoint.addToList(entities, Wolf, amount);
        });


		//COLLISION BOXES
		//STARTING AREA
		//upper north
		entities.push(new Obstacle(1350, 1740, "./resources/3.png", 50, 50, 174, 19, 5));
		//lower north
		entities.push(new Obstacle(775, 1837, "./resources/3.png", 50, 50, 250, 19, 5));
		//south 0
		entities.push(new Obstacle(775, 2412, "./resources/3.png", 50, 50, 180, 19, 5));
		//south 1
		entities.push(new Obstacle(1450, 2315, "./resources/3.png", 50, 50, 900, 19, 5));
		//south 2
		entities.push(new Obstacle(1640, 2218, "./resources/3.png", 50, 50, 39, 19, 5));


		//FIRST WALKWAY
		//west
		entities.push(new Obstacle(2030, 1350, "./resources/3.png", 50, 50, 19, 80, 5));
		//p1
		//south 0
		entities.push(new Obstacle(2223, 2218, "./resources/3.png", 50, 50, 327, 19, 5));
		//south 1
		entities.push(new Obstacle(2321, 2121, "./resources/3.png", 50, 50, 288, 19, 5));
		//south 2 left
		entities.push(new Obstacle(2416, 2024, "./resources/3.png", 50, 50, 115, 19, 5));
		//south 2 right
		entities.push(new Obstacle(3188, 2024, "./resources/3.png", 50, 50, 96, 19, 5));
		//p2
		//south 0
		entities.push(new Obstacle(4245, 2218, "./resources/3.png", 50, 50, 270, 19, 5));
		//south 1
		entities.push(new Obstacle(4348, 2121, "./resources/3.png", 50, 50, 230, 19, 5));
		//south 2
		entities.push(new Obstacle(4442, 2024, "./resources/3.png", 50, 50, 192, 19, 5));
		//p3
		//south 0
		entities.push(new Obstacle(5890, 2218, "./resources/3.png", 50, 50, 30, 19, 5));
		//south 1
		entities.push(new Obstacle(5987, 2121, "./resources/3.png", 50, 50, 30, 19, 5));
		//south 2
		entities.push(new Obstacle(6082, 2024, "./resources/3.png", 50, 50, 200, 19, 5));
		//east 0
		entities.push(new Obstacle(7045, 1640, "./resources/3.png", 50, 50, 19, 120, 5));
		//east 1
		entities.push(new Obstacle(7045, 1350, "./resources/3.png", 50, 50, 19, 19, 5));
		//eaasssst
		entities.push(new Obstacle(7143, 1399, "./resources/3.png", 50, 50, 19, 60, 5));


		//SECOND WLAKWAY
		//south 0 right
		entities.push(new Obstacle(6756, 1253, "./resources/3.png", 50, 50, 200, 19, 5));
		//south 1 right
		entities.push(new Obstacle(6756, 1155, "./resources/3.png", 50, 50, 200, 19, 5));
		//east
		entities.push(new Obstacle(7143, 563, "./resources/3.png", 50, 50, 19, 120, 5));
		//south 0 left
		entities.push(new Obstacle(2030, 1253, "./resources/3.png", 50, 50, 135, 19, 5));
		//south 0 middle
		entities.push(new Obstacle(2898, 1253, "./resources/3.png", 50, 50, 695, 19, 5));
		//south 1 left
		entities.push(new Obstacle(1447, 1155, "./resources/3.png", 50, 50, 985, 19, 5));
		//north
		entities.push(new Obstacle(760, 485, "./resources/3.png", 50, 50, 1300, 19, 5));
		//west
		entities.push(new Obstacle(675, 533, "./resources/3.png", 50, 50, 19, 400, 5));


		//ENDING/BARN AREA
		//0
		entities.push(new Obstacle(1450, 1450, "./resources/3.png", 50, 50, 19, 60, 5));
		//1
		entities.push(new Obstacle(1450, 1247, "./resources/3.png", 50, 50, 19, 25, 5));



		//OBSTACLES
		//STARTING AREA
		//big tree
		entities.push(new Obstacle(1500, 2400, "./resources/big_tree.png", 26, 31, 281, 255, 3));
		//tress
		entities.push(new Tree(1200, 1900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(900, 1950, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(950, 1900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1000, 1950, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1050, 1900, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		entities.push(new Tree(1100, 1950, "./resources/pinetree.png", 0, 0, 50, 82, 3, 40 * 2, 70 * 2));
		//trees outside the map
		//tree type1
		entities.push(new Tree(1300, 2600, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(1000, 2590, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(1400, 2600, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(500, 2700, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(690, 2740, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(1060, 2866, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		//tree type2
		entities.push(new Tree(1100, 2590, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(921, 2900, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(653, 2590, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(1353, 2590, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(777, 2700, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		//tree type3
		entities.push(new Tree(318, 2708, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1180, 2779, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1170, 2633, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(890, 2670, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(577, 2817, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));


		//FIRST PATHWAY
		//south facing bench
		entities.push(new Obstacle(2748 ,1270, "./resources/TX Props.png", 292, 19, 56, 40, 2));
		//horizontal coffin grave
		entities.push(new Obstacle(3025 ,2030, "./resources/TX Props.png", 288, 87, 64, 36, 2));
		//grave site
		//column
		entities.push(new Obstacle(3695, 2050, "./resources/TX Props.png", 352, 174, 32, 77, 2, 64, 56, false));
		//crumbled column
		entities.push(new Obstacle(4345, 2050, "./resources/TX Props.png", 416, 194, 32, 57, 2, 64, 56, false));
		entities.push(new Obstacle(5420, 2050, "./resources/TX Props.png", 416, 194, 32, 57, 2, 64, 56, false));
		//grave stones
		//cross
		entities.push(new Obstacle(3925, 2250, "./resources/TX Props.png", 227, 303, 26, 40, 2, 64, 56, false));
		//rip
		entities.push(new Obstacle(4025, 2250, "./resources/TX Props.png", 225, 239, 30, 41, 2, 64, 56, false));
		//small
		entities.push(new Obstacle(4125, 2250, "./resources/TX Props.png", 289, 251, 30, 29, 2, 64, 56, false));
		//werid ring
		entities.push(new Obstacle(2150, 1370, "./resources/TX Props.png", 420, 359, 55, 49, 3));
		//ancient stone
		entities.push(new Obstacle(3690, 1435, "./resources/TX Props.png", 227, 91, 26, 66, 3, 78, 52, false));
		//crumbled ancient stone
		entities.push(new Obstacle(3800, 1435, "./resources/TX Props.png", 227, 183, 26, 38, 3, 78, 52, false));
		//west side trees
		entities.push(new Tree(2600, 1400, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(2400, 1500, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(2200, 1600, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3600, 1420, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4300, 1510, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3680, 1600, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(4030, 1490, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		//werid cricle
		entities.push(new Obstacle(6580, 1710, "./resources/TX Props.png", 353, 269, 94, 72, 3));
		//west facing bench
		entities.push(new Obstacle(7060, 1480, "./resources/TX Props.png", 387, 2, 27, 61, 2));


		//SECOND PATHWAY
		//weird ring
		entities.push(new Obstacle(6940, 600, "./resources/TX Props.png", 420, 359, 55, 49, 3));
		//trees type 2
		entities.push(new Tree(1800, 1000, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3200, 900, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3500, 1100, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(2700, 600, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4100, 700, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		entities.push(new Tree(3900, 1090, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3400, 934, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5000, 1100, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5400, 670, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(6000, 740, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		entities.push(new Tree(6890, 900, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(6400, 830, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5500, 1150, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(6045, 940, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5689, 760, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		//type one trees
		entities.push(new Tree(6641, 1084, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(2974, 847, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5254, 824, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3991, 993, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5892, 956, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		entities.push(new Tree(2651, 1012, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4187, 857, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(2064, 765, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(2409, 1018, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4347, 917, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		entities.push(new Tree(6461, 1032, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(5457, 791, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(2122, 971, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4610, 884, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3896, 750, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));

		//type 3 trees
		entities.push(new Tree(3227, 998, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1180, 865, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3635, 818, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(2993, 890, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(2504, 706, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));

		entities.push(new Tree(3630, 964, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3433, 789, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1030, 742, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(890, 867, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3001, 1000, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));

		entities.push(new Tree(815, 818, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(859, 1007, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3501, 829, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1062, 864, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(1838, 736, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));




		//ENDING/BARN AREA
		//barn
		entities.push(new Barn(820, 1500, "./resources/starDewBuildings.png", 130, 0, 111, 104, 3, 10));
		//statue
		entities.push(new Obstacle(1700, 1650, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		entities.push(new Obstacle(1940, 1650, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		//chest
		entities.push(new Chest(1830, 1650, "./resources/TX Props.png", 96, 30, 31, 30, 2, 50, 50, false));
		//trees
		entities.push(new Tree(1600, 1710, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		//hidden block
		entities.push(new Obstacle(1448, 1350, "./resources/TX Tileset Stone Ground.png", 160, 0, 96, 96, 1, 96, 96, true));


		let tx = new Image(256, 256);
		tx.src = "./resources/TX Tileset Grass.png";

		let txStone = new Image(256, 256);
		txStone.src = "./resources/TX Tileset Stone Ground.png";
		//new tiles for a new map
		let grassTx = {
			x: 0,
			y: 0,
			width: 96,
			image: tx
		}
		let grassf = {
			x: 128,
			y: 0,
			width: 128,
			image: tx
		}
		let grassRoad = {
			x: 0,
			y: 128,
			width: 128,
			image: tx
		}
		let grassRoad2 = {
			x: 128,
			y: 128,
			width: 128,
			image: tx
		}
		let stoneTx = {
			x: 0,
			y: 0,
			width: 96,
			image: txStone
		}
		let stoneDot = {
			x: 160,
			y: 0,
			width: 96,
			image: txStone
		}
		let stonePallet = {
			x: 128,
			y: 192,
			width: 64,
			image: txStone
		}
		let stoneX = {
			x: 0,
			y: 0,
			width: 128,
			image: txStone
		}
		let stoneY = {
			x: 192,
			y: 192,
			width: 64,
			image: txStone
		}
		let tileData = [];
		tileData["default"] = grassTx;
		tileData["g"] = grassTx;
		tileData["f"] = grassf;
		tileData["v"] = grassRoad;
		tileData["h"] = grassRoad2;
		tileData["s"] = stoneTx;
		tileData["d"] = stoneDot;
		tileData["p"] = stonePallet;
		tileData["x"] = stoneX;
		tileData["y"] = stoneY;

		//tiles needed to cover the play area with current tile width - no longer used to determine size of map
		let xTile = 25; //canvas.width*2 / tileWidth - 1;
		let yTile = 25; //canvas.height*2 / tileWidth;
		mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	}

	if(importedMap.mapType == "levelTwo") {

		const shepherd = new Shepherd(4000, 3200);
        params.debugEntities.shepherd = shepherd;
        entities.push(shepherd);

		
        const startingArea = new SpawnPoint(3800, 3000, 200, 200);
        startingArea.addToList(entities, Sheep, 20);
		entities.push(startingArea);
		/*
        const wolfPacks = [
            [new SpawnPoint(2100, 1100, 450, 350), 5], // east path north
            [new SpawnPoint(2200, 2300, 330, 300), 5], // bridge over water
            [new SpawnPoint(5750, 1100, 450, 450), 3], // big open area after bridge
            [new SpawnPoint(6650, 1200, 300, 300), 2],
			[new SpawnPoint(4200, 4000, 300, 300), 4]  // small area by barn
        ];

        wolfPacks.forEach((info) => {
            const [spawnPoint, amount] = info;
			entities.push(spawnPoint);
            spawnPoint.addToList(entities, Wolf, amount);
        });
		*/


		//COLLISION
		//middle enclosed area
		//west
		entities.push(new Obstacle(3480, 500, "./resources/3.png", 50, 50, 19, 248, 5));
		entities.push(new Obstacle(3480, 1840, "./resources/3.png", 50, 50, 19, 95, 5));
		//east
		entities.push(new Obstacle(4435, 500, "./resources/3.png", 50, 50, 19, 248, 5));
		entities.push(new Obstacle(4435, 1934, "./resources/3.png", 50, 50, 19, 75, 5));
		//north
		entities.push(new Obstacle(3560, 1452, "./resources/3.png", 50, 50, 190, 19, 5));
		//south
		entities.push(new Obstacle(3560, 2220, "./resources/3.png", 50, 50, 190, 19, 5));
		//middle
		entities.push(new Obstacle(3960, 1500, "./resources/3.png", 50, 50, 19, 150, 5));

		//starting area
		//west
		entities.push(new Obstacle(2610, 970, "./resources/3.png", 50, 50, 19, 540, 5));
		//east
		entities.push(new Obstacle(5405, 1060, "./resources/3.png", 50, 50, 19, 480, 5));
		//south
		entities.push(new Obstacle(2610, 3380, "./resources/3.png", 50, 50, 770, 19, 5));

		//pathway
		//wall
		entities.push(new Obstacle(6370, 500, "./resources/3.png", 50, 50, 19, 480, 5));
		//entranceway east
		entities.push(new Obstacle(6370, 3400, "./resources/3.png", 50, 50, 19, 53, 5));

		//outer map
		//north
		entities.push(new Obstacle(1900, 490, "./resources/3.png", 50, 50, 1080, 19, 5));
		//south
		entities.push(new Obstacle(1900, 4445, "./resources/3.png", 50, 50, 1080, 19, 5));
		//east
		entities.push(new Obstacle(1835, 500, "./resources/3.png", 50, 50, 19, 800, 5));
		//west
		entities.push(new Obstacle(7045, 500, "./resources/3.png", 50, 50, 19, 800, 5));

		//OBSTACLES
		//STARTING AREA
		//trees
		//tree type1
		entities.push(new Tree(2900, 2500, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3100, 2990, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3200, 3200, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3300, 2200, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3400, 2840, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3560, 2866, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		//tree type2
		entities.push(new Tree(4100, 3180, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4001, 2900, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4253, 2590, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4353, 2590, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4447, 3000, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		//tree type3
		entities.push(new Tree(4718, 2708, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(4880, 2779, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(4970, 2933, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(5000, 2670, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(5177, 2817, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));

		//middle enclosed area
		//hidden block east
		entities.push(new Obstacle(3474, 1737, "./resources/TX Tileset Stone Ground.png", 160, 0, 96, 96, 1, 96, 96, true));
		//hidden block west
		entities.push(new Obstacle(4440, 1737, "./resources/TX Tileset Stone Ground.png", 0, 0, 96, 96, 1, 96, 96, true));
		entities.push(new Obstacle(4440, 1833, "./resources/TX Tileset Stone Ground.png", 0, 0, 96, 96, 1, 96, 96, true));
		//upper ring thing
		entities.push(new Obstacle(3620, 800, "./resources/TX Props.png", 353, 269, 94, 72, 3));
		entities.push(new Obstacle(4120, 800, "./resources/TX Props.png", 353, 269, 94, 72, 3));
		//bench
		entities.push(new Obstacle(3945, 700, "./resources/TX Props.png", 292, 19, 56, 40, 2));
		entities.push(new Obstacle(3700, 1510, "./resources/TX Props.png", 292, 19, 56, 40, 2));
		entities.push(new Obstacle(4200, 1510, "./resources/TX Props.png", 292, 19, 56, 40, 2));
		//grave yard
		//cross
		entities.push(new Obstacle(3925, 1250, "./resources/TX Props.png", 227, 303, 26, 40, 2, 64, 56, false));
		//rip
		entities.push(new Obstacle(4025, 1250, "./resources/TX Props.png", 225, 239, 30, 41, 2, 64, 56, false));
		//small
		entities.push(new Obstacle(4125, 1250, "./resources/TX Props.png", 289, 251, 30, 29, 2, 64, 56, false));
		
		//upper trees
		entities.push(new Tree(3900, 680, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3601, 340, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4353, 379, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(3700, 1300, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(4100, 1100, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		
		entities.push(new Tree(4300, 1180, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(3400, 1200, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(2720, 1900, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(1970, 620, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));
		entities.push(new Tree(4390, 700, "./resources/TX Plant.png", 24, 14, 112, 138, 2, 20, 10));

		entities.push(new Tree(2950, 1500, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(3200, 1690, "./resources/TX Plant.png", 161, 17, 94, 135, 2, 20, 10));
		entities.push(new Tree(6200, 680, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(5000, 700, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(4540, 1970, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		entities.push(new Tree(5177, 2817, "./resources/TX Plant.png", 295, 31, 76, 119, 2, 30, 12));
		//rocks
		entities.push(new Tree(4590, 600, "./resources/TX Props.png", 3, 430, 57, 42, 3));
		//type 1
		entities.push(new Obstacle(4700, 1800, "./resources/TX Props.png", 40, 490, 16, 14, 1.5));
		//type 2
		entities.push(new Obstacle(4900, 1950, "./resources/TX Props.png", 68, 487, 24, 19, 1.5));
		//type 3
		entities.push(new Obstacle(5100, 2000, "./resources/TX Props.png", 100, 487, 24, 19, 1.5));
		entities.push(new Obstacle(5200, 2200, "./resources/TX Props.png", 100, 487, 24, 19, 1.5));
		//type 4
		entities.push(new Obstacle(4800, 2170, "./resources/TX Props.png", 162, 482, 27, 27, 1.5));

		//statue
		entities.push(new Obstacle(3600, 2150, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		entities.push(new Obstacle(4340, 2150, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		//chest
		entities.push(new Chest(3730, 2150, "./resources/TX Props.png", 96, 30, 31, 30, 2, 50, 50, false));
		entities.push(new Chest(3830, 2150, "./resources/TX Props.png", 96, 30, 31, 30, 2, 50, 50, false));
		entities.push(new Chest(4230, 2150, "./resources/TX Props.png", 96, 30, 31, 30, 2, 50, 50, false));
		//ring thing
		entities.push(new Obstacle(6620, 800, "./resources/TX Props.png", 353, 269, 94, 72, 3));

		//east pathway (hard)
		//bush barriers
		entities.push(new Obstacle(1930, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2014, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2098, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2182, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2266, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2350, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2434, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2518, 970, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));

		entities.push(new Obstacle(1930, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2014, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2098, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2182, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2266, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2350, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2434, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2518, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));

		entities.push(new Obstacle(1930, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2014, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2098, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2182, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2266, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2350, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2434, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(2518, 3100, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));

		//west pathwaty
		//bush barriers
		entities.push(new Obstacle(5510, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(5594, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(5678, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(5762, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(5846, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(5930, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6014, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6098, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6182, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6266, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));

		entities.push(new Obstacle(6476, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6560, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6644, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6729, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6812, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6896, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		entities.push(new Obstacle(6980, 2035, "./resources/forestground.png", 423, 481, 78, 84, 1.5, 78, 84, true));
		//statue
		entities.push(new Obstacle(6650, 600, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		entities.push(new Obstacle(6890, 600, "./resources/TX Props.png", 445, 21, 36, 74, 2, 70, 50, false));
		//chest
		entities.push(new Chest(6780, 600, "./resources/TX Props.png", 96, 30, 31, 30, 2, 50, 50, false));

		//ENDING/BARN AREA
		entities.push(new Barn(3200, 3750, "./resources/starDewBuildings.png", 130, 0, 111, 105, 3, 10));



		//tileset
		let tx = new Image(256, 256);
		tx.src = "./resources/TX Tileset Grass.png";

		let txStone = new Image(256, 256);
		txStone.src = "./resources/TX Tileset Stone Ground.png";

		let txWall = new Image(512, 512);
		txWall.src = "./resources/TX Wall.png";

		//new tiles for a new map
		let grassTx = {
			x: 0,
			y: 0,
			width: 96,
			image: tx
		}
		let grassf = {
			x: 128,
			y: 0,
			width: 128,
			image: tx
		}
		let grassRoad = {
			x: 0,
			y: 128,
			width: 128,
			image: tx
		}
		let grassRoad2 = {
			x: 128,
			y: 128,
			width: 128,
			image: tx
		}
		let stoneTx = {
			x: 0,
			y: 0,
			width: 96,
			image: txStone
		}
		let stoneDot = {
			x: 160,
			y: 0,
			width: 96,
			image: txStone
		}
		let stonePallet = {
			x: 128,
			y: 192,
			width: 64,
			image: txStone
		}
		let stoneX = {
			x: 0,
			y: 0,
			width: 128,
			image: txStone
		}
		let stoneY = {
			x: 192,
			y: 192,
			width: 64,
			image: txStone
		}
		let hWall = {
			x: 32,
			y: 288,
			width: 64,
			image: txWall
		}
		let tileData = [];
		tileData["default"] = grassTx;
		tileData["g"] = grassTx;
		tileData["f"] = grassf;
		tileData["v"] = grassRoad;
		tileData["h"] = grassRoad2;
		tileData["s"] = stoneTx;
		tileData["d"] = stoneDot;
		tileData["p"] = stonePallet;
		tileData["x"] = stoneX;
		tileData["y"] = stoneY;
		tileData["w"] = hWall;

		//tiles needed to cover the play area with current tile width - no longer used to determine size of map
		let xTile = 25; //canvas.width*2 / tileWidth - 1;
		let yTile = 25; //canvas.height*2 / tileWidth;
		mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	}


	if(importedMap.mapType == "levelThree") {
		//COLLISION
		//starting area
		entities.push(new Obstacle(3100, 3100, "./resources/3.png", 50, 50, 19, 80, 5));
		entities.push(new Obstacle(3100, 3100, "./resources/3.png", 50, 50, 327, 19, 5));

		//OBSTACLES
		

		//STARTING AREA


		//tileset
		let tx = new Image(256, 256);
		tx.src = "./resources/TX Tileset Grass.png";

		let txStone = new Image(256, 256);
		txStone.src = "./resources/TX Tileset Stone Ground.png";

		let txWall = new Image(512, 512);
		txWall.src = "./resources/TX Wall.png";

		//new tiles for a new map
		let grassTx = {
			x: 0,
			y: 0,
			width: 96,
			image: tx
		}
		let grassf = {
			x: 128,
			y: 0,
			width: 128,
			image: tx
		}
		let grassRoad = {
			x: 0,
			y: 128,
			width: 128,
			image: tx
		}
		let grassRoad2 = {
			x: 128,
			y: 128,
			width: 128,
			image: tx
		}
		let stoneTx = {
			x: 0,
			y: 0,
			width: 96,
			image: txStone
		}
		let stoneDot = {
			x: 160,
			y: 0,
			width: 96,
			image: txStone
		}
		let stonePallet = {
			x: 128,
			y: 192,
			width: 64,
			image: txStone
		}
		let stoneX = {
			x: 0,
			y: 0,
			width: 128,
			image: txStone
		}
		let stoneY = {
			x: 192,
			y: 192,
			width: 64,
			image: txStone
		}
		let hWall = {
			x: 32,
			y: 288,
			width: 64,
			image: txWall
		}
		let tileData = [];
		tileData["default"] = grassTx;
		tileData["g"] = grassTx;
		tileData["f"] = grassf;
		tileData["v"] = grassRoad;
		tileData["h"] = grassRoad2;
		tileData["s"] = stoneTx;
		tileData["d"] = stoneDot;
		tileData["p"] = stonePallet;
		tileData["x"] = stoneX;
		tileData["y"] = stoneY;
		tileData["w"] = hWall;

		//tiles needed to cover the play area with current tile width - no longer used to determine size of map
		let xTile = 25; //canvas.width*2 / tileWidth - 1;
		let yTile = 25; //canvas.height*2 / tileWidth;
		mainEnvironment = new Environment(xTile, yTile, tileData, -1, importedMap);
	}

	if(importedMap.mapType == "levelFour") {
		//COLLISION

		//OBSTACLES
		

		//STARTING AREA


		//tileset
		let tx = new Image(256, 256);
		tx.src = "./resources/TX Tileset Grass.png";

		let txStone = new Image(256, 256);
		txStone.src = "./resources/TX Tileset Stone Ground.png";

		let txWall = new Image(512, 512);
		txWall.src = "./resources/TX Wall.png";

		//new tiles for a new map
		let grassTx = {
			x: 0,
			y: 0,
			width: 96,
			image: tx
		}
		let grassf = {
			x: 128,
			y: 0,
			width: 128,
			image: tx
		}
		let grassRoad = {
			x: 0,
			y: 128,
			width: 128,
			image: tx
		}
		let grassRoad2 = {
			x: 128,
			y: 128,
			width: 128,
			image: tx
		}
		let stoneTx = {
			x: 0,
			y: 0,
			width: 96,
			image: txStone
		}
		let stoneDot = {
			x: 160,
			y: 0,
			width: 96,
			image: txStone
		}
		let stonePallet = {
			x: 128,
			y: 192,
			width: 64,
			image: txStone
		}
		let stoneX = {
			x: 0,
			y: 0,
			width: 128,
			image: txStone
		}
		let stoneY = {
			x: 192,
			y: 192,
			width: 64,
			image: txStone
		}
		let hWall = {
			x: 32,
			y: 288,
			width: 64,
			image: txWall
		}
		let tileData = [];
		tileData["default"] = grassTx;
		tileData["g"] = grassTx;
		tileData["f"] = grassf;
		tileData["v"] = grassRoad;
		tileData["h"] = grassRoad2;
		tileData["s"] = stoneTx;
		tileData["d"] = stoneDot;
		tileData["p"] = stonePallet;
		tileData["x"] = stoneX;
		tileData["y"] = stoneY;
		tileData["w"] = hWall;

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