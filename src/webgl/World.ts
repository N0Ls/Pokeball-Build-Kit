import { Raycaster, Vector2 } from "three";
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
    raycaster : Raycaster;
    sizes: any;

    mouse: Vector2;

    constructor() {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;

        this.sizes = this.experience.sizes;

        this.raycaster = new Raycaster();

        const mouse = new Vector2();


        // Wait for resources
        this.resources.on("ready", () => {
            this.lighting = new Lighting();
            this.pokeball = new Pokeball();

            this.init();
        });

        this.experience.canvas?.addEventListener("mousemove", (event) =>
        {
            mouse.x = event.clientX / this.sizes.width * 2 - 1;
            mouse.y = - (event.clientY / this.sizes.height) * 2 + 1;
        });

        this.experience.canvas?.addEventListener("click", () =>
        {
            this.raycaster.setFromCamera(mouse, this.experience.camera.instance);
            const modelIntersects = this.raycaster.intersectObject(this.scene);
            
            if(this.pokeball && modelIntersects.length > 0) this.pokeball.playAnimation(modelIntersects[0].object.name + "Action");
            
        });
    }

    playOpenAnimation() {
        this.pokeball.playOpenAnimation();
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