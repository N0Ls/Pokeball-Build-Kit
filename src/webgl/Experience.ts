import * as THREE from "three";
import * as dat from "lil-gui";
import Stats from "stats-gl";


import World from "./World.js";
import Camera from "./Camera.js";
import Time from "./utils/Time.js";
import Sizes from "./utils/Sizes.js";
import Renderer from "./Renderer.js";
import Resources from "./utils/Resources.js";
// import PostProcessing from "./PostProcessing.js";

import sources from "./sources.js";
import AudioEngine from "./AudioEngine.js";

export default class Experience {
    instance: Experience | null;
    static instance;
    welcomeDiv: HTMLElement;
    startButton: HTMLElement;
    hasEnteredExperience: boolean;
    chronoText: HTMLElement;
    

    static getInstance () {
        if (!Experience.instance) {
            Experience.instance = new Experience();
        }
        return Experience.instance;
    }

    isDebug: boolean;

    canvas: HTMLCanvasElement | null;
    sizes: Sizes;
    time: Time;
    scene: THREE.Scene;
    camera: Camera;
    renderer: Renderer;

    resources: Resources;
    world: World;
    audioEngine: AudioEngine;

    gui: dat.GUI;
    stats: Stats;

    // postProcessing: PostProcessing;

    isPlaying: boolean;

    constructor() {
        // Singleton
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;

        // @ts-ignore
        window.experience = this;

        this.isDebug = false;

        // Variables
        const canvas = document.querySelector("canvas");
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        // this.postProcessing = new PostProcessing();

        this.resources = new Resources(sources);

        this.hasEnteredExperience = false;

        //this.audioEngine = new AudioEngine();

        this.world = new World();

        this.init();

        this.chronoText = document.querySelector(".time") as HTMLElement;
        const chronoDiv = document.querySelector(".chrono") as HTMLElement;

        this.welcomeDiv = document.querySelector(".welcome-div") as HTMLElement;
        this.startButton = document.querySelector(".startButton") as HTMLElement;

        this.startButton?.addEventListener("click", () => {
            if(this.hasEnteredExperience) return;
            const loaderHTML = document.querySelector(".loader") as HTMLElement;
            loaderHTML.style.opacity = "0";
            chronoDiv.style.opacity = "1";

            setTimeout(() => {
                this.hasEnteredExperience = true;
                this.world.playOpenAnimation();
            }, 1200);
        });

        this.resources.on("ready", () => {
            // Add fake time
            setTimeout(() => {
                const svgLoader = document.querySelector(".svg-loader") as HTMLElement;
                svgLoader.style.opacity = "0";
                this.welcomeDiv.style.opacity = "1";
                this.startButton.style.opacity = "1";
            }, 1300);

        }); 

        // Resize event
        this.sizes.on("resize", () => {
            this.resize();
        });

        // Time tick event
        this.time.on("tick", () => {
            if(this.isPlaying) this.updateChronoText();
            this.update();
        });
    }

    updateChronoText() {
        const currentTime = this.time.currentTimeChrono;
        //convert milliseconds to minutes and seconds

        const minutes = Math.floor(currentTime / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);
        const milliseconds = Math.floor((currentTime % 1000) / 10);

        //convert to string
        const finalMinutes = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        const finalSeconds = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
        const finalMilliseconds = milliseconds < 10 ? "0" + milliseconds.toString() : milliseconds.toString();


        this.chronoText.innerHTML = finalMinutes + ":" + finalSeconds + ":" + finalMilliseconds;
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        //this.postProcessing.resize();
    }

    update() {
        this.camera.update();
        this.renderer.update();
        this.world.update();
        //this.postProcessing.update();
    }

    init() {
        this.isPlaying = true;
        if(this.isDebug) {
            this.initGUI();
            this.initStats();
        }
    }

    initGUI() {
        this.gui = new dat.GUI();
        
        const functionButton = {
            doSomething: () => {
                this.onDoSomething();
            },
        };
        this.gui.add(functionButton, "doSomething").name("Function Button");

        this.gui.close();

    }

    initStats() {
        const container = document.getElementById( "container" );

        this.stats = new Stats({
            logsPerSecond: 20, 
            samplesLog: 100, 
            samplesGraph: 10, 
            precision: 2, 
            horizontal: true,
            minimal: false, 
            mode: 0 
        });

        container?.appendChild( this.stats.container );

        this.stats.init(this.renderer.instance?.domElement);

        this.scene.onBeforeRender = () => {
            this.stats.begin();
        };

        this.scene.onAfterRender = () => {
            this.stats.end();
        };
    }

    onDoSomething() {
        console.log("Do something");
    }

    destroy() {
        this.sizes.off("resize");
        this.time.off("tick");

        this.renderer.destroy();

        this.world.destroy();

        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose();

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === "function")
                    {
                        value.dispose();
                    }
                }
            }
        });

        Experience.instance = null;

        this.audioEngine.destroy();

        if(this.isDebug) {
            if(this.gui)
                this.gui.destroy();
        }
    }

}