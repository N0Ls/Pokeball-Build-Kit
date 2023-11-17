import Experience from "./Experience.js";
import Lighting from "./scene/Lighting.js";
import Pokeball from "./scene/Pokeball.js";

export default class World {
    experience: Experience;
    // eslint-disable-next-line no-undef
    scene: THREE.Scene;

    resources: any;

    pokeball: Pokeball;
    lighting: Lighting;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.lighting = new Lighting();
            this.pokeball = new Pokeball();

            this.init();
        });
    }

    init() {
        this.pokeball.init();
    }

    update() {
        if(this.pokeball) this.pokeball.update();
    }

    destroy() {
    }

}