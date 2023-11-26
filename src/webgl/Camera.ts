import * as THREE from "three";
import Experience from "./Experience.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Sizes from "./utils/Sizes.js";

export default class Camera
{
    experience: Experience;
    sizes: Sizes;
    scene: THREE.Scene;

    canvas: HTMLCanvasElement | null;

    instance: THREE.PerspectiveCamera;
    controls: OrbitControls;
    constructor()
    {
        this.experience = Experience.getInstance();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setControls();
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.01, 1000);
        this.instance.position.set(0.11, 0.06, 0.26);

        /* ORTHOGRAPHIC CAMERA */
        // this.instance = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 5 );
        // this.instance.position.set(0, 0, 1)
        this.scene.add(this.instance);
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    setControls()
    {
        if (this.canvas) {
            this.controls = new OrbitControls(this.instance, this.canvas);
            this.controls.enableDamping = true;
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update()
    {
        this.controls.update();
    }
}