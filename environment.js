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
    constructor(width, height, tileData, tileTypes, tileSize = 50) {
        if (!("default" in tileData)) throw new Error("No default tile defined");
        for (const tileType in tileData) {
            const tile = tileData[tileType];
            if ( !("x" in tile) || !("y" in tile)
              || !("width" in tile) || !("image" in tile)
            ) {
                throw new Error("Tile data must contain x, y, width, and image");
            }
        }

        this.z = -1;
        this.width = width;
        this.height= height;
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
            // Default Map
            for (let i = 0; i < height; i++) {
                this.tileTypes[i] = [];
                for (let j = 0; j < width; j++) {
                    if (i < 2 || j < 2) this.tileTypes[i][j] = "water";
                    else this.tileTypes[i][j] = "default";
                }
            }
            //lava for spawn area
            this.tileTypes[0][0] = "lava";
            this.tileTypes[0][1] = "lava";
            this.tileTypes[1][0] = "lava";
            this.tileTypes[1][1] = "lava";
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
                const worldX = j * this.tileSize;
                const worldY = i * this.tileSize;

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