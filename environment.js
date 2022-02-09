// TODO
class Environment {
    /**
     *
     * @param {Number} width Width of the environment in tiles
     * @param {Number} height Height of the environment in tiles
     * @param {Object} tileData All types of tiles in the format:
     * {
     *    tileTypeName: {
     *      x: 0, // x pixel position
     *      y: 0, // y pixel position
     *      width: 32, // pixel width/height of the tile
     *      image: new Image(), // image to draw from
     *   }
     * }
     * @param {Array<Array<String>>} tileTypes 2D array of tile types
     */
    constructor(width, height, tileData, z, tileTypes, tileSize = 96.5) {
        if (!("default" in tileData)) throw new Error("No default tile defined");
        for (const tileType in tileData) {
            const tile = tileData[tileType];
            if ( !("x" in tile) || !("y" in tile)
              || !("width" in tile) || !("image" in tile)
            ) {
                throw new Error("Tile data must contain x, y, width, and image");
            }
        }

        this.z = z;
        this.width = width;
        this.height= height;
        //console.log("height: " + height);
        this.tileData = tileData;

        this.isZoomable = true;
        this.isRelative = true;

        this.entities = [];
        this.tileSize = tileSize;

        // Initialize tileTypes before it can be read as undefined
        this.tileTypes = [];
        if (tileTypes) {
            this.tileTypes = tileTypes;
        } else {

            if(this.z == -1){
                //constucting map
            // initialize every tile as default
            for (let i = 0; i < height; i++) {
                this.tileTypes[i] = [];
                for (let j = 0; j < width; j++) {
                    this.tileTypes[i][j] = "default";
                }
            }
            //building onto map
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    //place light grass tiles
                    if(i > floor(height/2)){
                        this.tileTypes[i][j] = "lightGrass";
                    }
                    //place water tiles
                    if (i < 1 || j < 1 || i > height-1 || j > width-1 || i == floor(height/2)){
                        this.tileTypes[i][j] = "water";
                    }
                    //place edge tiles
                    if(i == floor(height/2)-1 && j > 0 && j < width){
                        this.tileTypes[i][j] = "grassEdge";
                    }
                    if(i == floor(height)-1 && j > 0 && j < width){
                        this.tileTypes[i][j] = "lightGrassEdge";
                    }
                }
            }
            //fills background layer with one tile
            } else {
                //this.isZoomable = false;
                //this.isRelative = false;
                this.tileSize = 192;
                for (let i = 0; i < height; i++) {
                    this.tileTypes[i] = [];
                    for (let j = 0; j < width; j++) {
                        this.tileTypes[i][j] = "default";
                    }
                }
            }

        }
    }

    addEntity(gameEngine, entity) { this.addEntities(gameEngine, [entity]); }
    addEntities(gameEngine, entities) {
        this.entities = this.entities.concat(entities);
        gameEngine.addEntities(entities);
    }

    removeEntity(entity) { entity.removeFromWorld = true; }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return -1;
        return this.tileTypes[y][x];
    }

    setTile(x, y, type) {
        if (this.getTile(x, y) === -1) throw new Error("Invalid tile");
        if (!(type in this.tileData)) throw new Error("Invalid tile type");
        this.tileTypes[y][x] = type;
    }

    update() {
        // Remove "dead" entities
        this.entities = this.entities.filter(entity => !entity.removeFromWorld);
    }

    serialize() {
        // TODO
    }

    static deserialize(data) {
        // TODO
    }

    draw(ctx) {

        for (let i = 0; i < this.height; i++) {

            for (let j = 0; j < this.width; j++) {

                const tileType = this.tileTypes[i][j];
                const { x, y, width, image } = this.tileData[tileType];
                const scaleFactor = this.tileSize / width;
                let worldX = j * this.tileSize;
                let worldY = i * this.tileSize;
                if(this.z == -2){
                    worldX = (0 - this.height*this.tileSize)/2.5 + j * this.tileSize;
                    worldY = (0 - this.width*this.tileSize)/6 + i * this.tileSize;
                }

                const wasImageSmoothingEnabled = ctx.imageSmoothingEnabled;
                ctx.imageSmoothingEnabled = true;
                //console.log(image, x, y, this.width, this.height, worldX, worldY, scaleFactor);
                ctx.drawImage(
                    image,
                    x, y,
                    width, width,
                    worldX, worldY,
                    scaleFactor * width, scaleFactor * width
                );
                ctx.imageSmoothingEnabled = wasImageSmoothingEnabled;
            }
        }
    }
}