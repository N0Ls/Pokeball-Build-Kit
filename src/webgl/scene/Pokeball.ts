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

        this.animation.actions = {};

        //for each animation in the resource.animations array, create a new action

        for(let i = 0; i < this.resource.animations.length; i++){
            this.animation.actions[this.resource.animations[i].name] = this.animation.mixer.clipAction(this.resource.animations[i]);
            this.animation.actions[this.resource.animations[i].name].setLoop(THREE.LoopOnce);
            this.animation.actions[this.resource.animations[i].name].clampWhenFinished = true;
        }

        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            // newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        };

        this.animation.mixer.addEventListener("finished", (e) =>
        {
            if(e.action.timeScale > 0){
                e.action.timeScale = -1;
            }
        });
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        this.model.rotation.y = Math.PI;
        this.scene.add(this.model);
    }

    update()
    {
        this.model.rotation.y += 0.01;

        this.animation.mixer.update(this.time.delta * 0.001);
    }   
}