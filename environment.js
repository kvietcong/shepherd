// TODO
class Environment {
    /**
     *
     * @param {Number} width Width of the environment in tiles
     * @param {Number} height Height of the environment in tiles
     * @param {Image} tileSet Image containing all the tiles
     * @param {Object} tileData All types of tiles in the format:
     * {
     *    tileTypeName: {
     *      x: 0, // x pixel position
     *      y: 0, // y pixel position
     *      width: 32 // pixel width/height of the tile
     *   }
     * }
     * @param {Array<Array<String>>} tileTypes 2D array of tile types
     */
    constructor(width, height, tileSet, tileData, tileTypes) {
        if (!("default" in tileData)) throw new Error("No default tile defined");

        this.entities = [];

        this.pixels = 50;

        this.tileTypes;
        if (tileTypes) {
            this.tileTypes = tileTypes;
        } else {
            for (let i = 0; i < height; i++) {
                this.tileTypes[i] = [];
                for (let j = 0; j < width; j++) {
                    this.tileTypes[i][j] = "default";
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
                const { x, y, width } = this.tileData[tileType];
                const scaleFactor = this.pixels / width;
                const worldX = j * this.pixels;
                const worldY = i * this.pixels;

                const wasImageSmoothingEnabled = ctx.imageSmoothingEnabled;
                ctx.imageSmoothingEnabled = this.isImageSmoothingEnabled;
                ctx.save();
                ctx.drawImage(
                    this.tileSet,
                    x, y,
                    this.width, this.width,
                    worldX, worldY,
                    scaleFactor * width, scaleFactor * width
                );
                ctx.restore();
                ctx.imageSmoothingEnabled = wasImageSmoothingEnabled;
            }
        }
    }
}