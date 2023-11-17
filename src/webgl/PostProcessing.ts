import * as THREE from "three";
import Experience from "./Experience.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

import coloramaVertexShader from "./shaders/colorama/vertex.glsl";
import coloramaFragmentShader from "./shaders/colorama/fragment.glsl";

import dotScreenVertexShader from "./shaders/dotScreen/dotScreen.vert";
import dotScreenFragmentShader from "./shaders/dotScreen/dotScreen.frag";

export default class PostProcessing {

    experience: Experience;
    canvas: HTMLCanvasElement | null;
    sizes: any;
    scene: THREE.Scene;
    camera: any;

    instance: EffectComposer;
    constructor() {
        this.experience = Experience.getInstance();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setInstance();
    }

    setInstance() {

        this.instance = new EffectComposer(this.experience.renderer.instance);
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const renderPass = new RenderPass(this.scene, this.camera.instance);
        this.instance.addPass(renderPass);

        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
        gammaCorrectionPass.enabled = false;
        this.instance.addPass(gammaCorrectionPass);

        const ColoramaShader = {
            uniforms:
            {
                tDiffuse: { value: null },
                color1: { value: new THREE.Color("hsl(228, 100%, 50%)") },
                color2: { value: new THREE.Color("hsl(173, 100%, 50%)") },
                uTime: { value: 0 }
            },
            vertexShader: coloramaVertexShader,
            fragmentShader: coloramaFragmentShader
        };

        const coloramaPass = new ShaderPass(ColoramaShader);
        coloramaPass.enabled = true;
        this.instance.addPass(coloramaPass);

        const dotScreenShader = {
            uniforms: {
                tDiffuse: { value: null },
                tSize: { value: new THREE.Vector2(256, 256) },
                center: { value: new THREE.Vector2(0.5, 0.5) },
                angle: { value: 1.57 },
                scale: { value: 1.0 },
            },
            vertexShader: dotScreenVertexShader,
            fragmentShader: dotScreenFragmentShader,
        };

        const dotScreenPass = new ShaderPass(dotScreenShader);
        dotScreenPass.enabled = true;
        this.instance.addPass(dotScreenPass);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(); 
    }

    destroy() {
        this.instance.dispose();
    }
}