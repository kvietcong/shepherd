class Map {
    /**
     * Test = OG Map
     * Forest = starting map
     * @param {String} mapType denote which map you wish to load
     */
    constructor(mapType) {
        this.mapType = mapType;
        this.tiles = [];
        this.width;
        this.height;

        if(this.mapType == "Test"){
            console.log("entered test creation loop");
            // initialize every tile as default
            for (let i = 0; i < 16; i++) {
                this.tiles[i] = [];
                for (let j = 0; j < 16; j++) {
                    this.tiles[i][j] = "default";
                }
            }

            //building onto map
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 16; j++) {
                    //place light grass tiles
                    if(i > floor(16/2)){
                        this.tiles[i][j] = "lightGrass";
                    }
                    //place water tiles
                    if (i < 1 || j < 1 || i > 16-1 || j > 16-1 || i == floor(16/2)){
                        this.tiles[i][j] = "water";
                    }
                    //place edge tiles
                    if(i == floor(16/2)-1 && j > 0 && j < 16){
                        this.tiles[i][j] = "grassEdge";
                    }
                    if(i == floor(16)-1 && j > 0 && j < 16){
                        this.tiles[i][j] = "lightGrassEdge";
                    }
                    if(i == floor(16/2) && j == floor(16/2) || i == floor(16/2) && j == floor(16/2)+1){
                        this.tiles[i][j-1] = "wood";
                        this.tiles[i][j] = "wood";
                        
                    }
                }
            }
        }


        if(this.mapType == "Forest"){
            /*
            const input = new File([""], "./resources/testForest.csv");
            const reader = new FileReader();
            let bru = reader.readAsText(input);
            this.tiles = this.csvToArray(bru);
            */
           
           this.tiles = [
               ["water", "water", "water", "water", "water", "water", "water", "water", "water", "water", "water", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["water", "water", "water", "water", "water", "water", "water", "water", "water", "water", "water", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["water", "water", "water", "water", "water", "water", "water", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["water", "water", "water", "water", "water", "water", "water", "water", "forest", "forestFlower", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["water", "water", "water", "water", "water", "water", "water", "water", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "rock", "rock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forestMud", "forestMud", "forestMud", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forestMud", "forestMud", "forestMud", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "forest", "forest", "forest", "forest", "forest", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "rwater", "dwater", "dwater", "dwater", "dwater", "dwater", "rwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "rwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "wood", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "swater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "dwater", "rwater", "dwater", "dwater", "dwater", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "vrock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "rock", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"],
               ["forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest", "forest"]
           ];
           //will break if all rows are not the same length
           this.width = this.tiles[0].length;
           this.height = this.tiles.length;
        }
    }
}