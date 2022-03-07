params.supportedImageTypes = ["png", "jpg", "jpeg", "gif"];
params.supportedAudioTypes = ["mp3", "ogg", "wav"];

class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.sounds = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        if (params.isDebugging) console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const path = this.downloadQueue[i];
            if (params.isDebugging) console.log(path);

            const extension = path.split(".").pop();
            if (params.supportedImageTypes.includes(extension))
                this.downloadImage(path, callback);
            else if (params.supportedAudioTypes.includes(extension))
                this.downloadAudio(path, callback);
        }
    };

    downloadImage(path, callback) {
        const image = new Image();

        image.addEventListener("load", () => {
            if (params.isDebugging) console.log("Loaded " + path);
            this.successCount++;
            if (this.isDone()) callback();
        });

        image.addEventListener("error", () => {
            console.log("Error loading " + path);
            this.errorCount++;
            if (this.isDone()) callback();
        });

        image.src = path;
        this.cache[path] = image;
    }

    downloadAudio(path, callback) {
        const audio = new Audio();
        const name = path.match(/[^\/]+$/)[0].split('.')[0];
        console.log(name)

        audio.addEventListener("loadeddata", () => {
            if (params.isDebugging) console.log("Loaded " + path);
            this.successCount++;
            if (this.isDone()) callback();
        });

        audio.addEventListener("error", () => {
            console.log("Error loading " + path);
            this.errorCount++;
            if (this.isDone()) callback();
        });

        audio.addEventListener("ended", () => {
            audio.pause();
            audio.currentTime = 0;
        });

        audio.src = path;
        audio.load();

        this.cache[path] = audio;
        if (name) {
            this.sounds[name] = audio;
        }
    }

    playSound(name, volume=1) {
        const sound = this.sounds[name]?.cloneNode();
        sound.volume = volume * params.volume;
        sound?.play();
    }

    getAsset(path) {
        return this.cache[path];
    };
};
