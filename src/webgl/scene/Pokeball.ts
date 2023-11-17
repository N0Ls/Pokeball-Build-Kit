import * as THREE from "three";
import Experience from "../Experience.js";

export default class Pokeball
{
    experience: Experience;
    scene: THREE.Scene;
    resources: any;
    resource: any;
    sizes: any;

    gui: any;

    model: THREE.Object3D;
    material : THREE.MeshStandardMaterial;
    animation;
    time : any;
    constructor()
    {
        this.experience = Experience.getInstance();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.pokeball;
        this.sizes = this.experience.sizes;
        this.gui = this.experience.gui;
        this.time = this.experience.time;

    }

    init(){
        this.setModel();
        this.setAnimation( );
        // this.setMaterial();
        this.setGUI();
    }

    setGUI() {
        
    }

    setMaterial(){
        this.material = new THREE.MeshStandardMaterial({
            color : 0xFF0000
        });
        this.model.traverse((child) => {
            child.material = this.material;
        });

    }

    setAnimation()
    {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        this.animation.action = this.animation.mixer.clipAction(this.resource.animations[7]);
        this.animation.action.play();

        this.animation.actions = {};
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[7]);
        this.animation.actions.open = this.animation.mixer.clipAction(this.resource.animations[8]);
        this.animation.actions.idle.setLoop(THREE.LoopOnce);
        this.animation.actions.open.setLoop(THREE.LoopOnce);
        this.animation.actions.idle.clampWhenFinished = true;
        this.animation.actions.open.clampWhenFinished = true;


        this.animation.actions.current = this.animation.actions.idle;
        this.animation.actions.current.play();

        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            // newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        };


        console.log(this.animation.actions);
        console.log(this.resource.animations);

        // // Debug
        // if(this.debug.active)
        // {
        //     const debugObject = {
        //         playIdle: () => { this.animation.play("idle"); },
        //         playWalking: () => { this.animation.play("walking"); },
        //         playRunning: () => { this.animation.play("running"); }
        //     };
        //     this.debugFolder.add(debugObject, "playIdle");
        //     this.debugFolder.add(debugObject, "playWalking");
        //     this.debugFolder.add(debugObject, "playRunning");
        // }
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        this.model.rotation.y = Math.PI;
        this.scene.add(this.model);

        console.log(this.resource.animations);
    }

    update()
    {
        this.model.rotation.y += 0.01;

        this.animation.mixer.update(this.time.delta * 0.001);
    }   
}