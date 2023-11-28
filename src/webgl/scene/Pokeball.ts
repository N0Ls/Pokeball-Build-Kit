import * as THREE from "three";
import Experience from "../Experience.js";
import gsap from "gsap";

export default class Pokeball
{
    experience: Experience;
    scene: THREE.Scene;
    resources: any;
    resource: any;
    sizes: any;

    gui: any;

    model: THREE.Object3D;
    glassMaterial : THREE.MeshPhysicalMaterial;
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
        this.experience.time.startChrono();
        this.setModel();
        this.setAnimation( );
        this.setMaterial();
        this.setGUI();
    }

    setGUI() {
        
    }

    setMaterial(){
        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 0.99,
            transparent: true,
            ior: 1.5,
            color: 0x70c8ff,
            thickness: 0.002,
            metalness: 0,
            roughness: 0,
        });

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh && child.material.name === "PlasticBlue"){
                child.material = this.glassMaterial;
            }

        });

    }

    setAnimation()
    {
        this.animation = {};
        this.animation.mixer = new THREE.AnimationMixer(this.model);
        // this.animation.action = this.animation.mixer.clipAction(this.resource.animations[7]);

        this.animation.actions = {};

        this.animation.actionsDone = {};

        //for each animation in the resource.animations array, create a new action

        for(let i = 0; i < this.resource.animations.length; i++){
            this.animation.actions[this.resource.animations[i].name] = this.animation.mixer.clipAction(this.resource.animations[i]);
            this.animation.actions[this.resource.animations[i].name].setLoop(THREE.LoopOnce);
            this.animation.actions[this.resource.animations[i].name].clampWhenFinished = true;
            this.animation.actions[this.resource.animations[i].name].paused = true;

            this.animation.actions[this.resource.animations[i].name].play();
            this.animation.actionsDone[this.resource.animations[i].name] = false;
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
                e.action.timeScale = -1.5;
            }
            const status = this.checkPuzzleStatus();
            if(status === 1){
                // console.log(this.experience.time.elapsed);
                this.experience.isPlaying = false;

                setTimeout(() => {
                    this.experience.endPuzzle();
                }, 1200);
            }
        });

        // play animation for belt
        this.animation.actionsDone["BeltAction"] = true;
    }

    playOpenAnimation() {
        // iterate through all actions and unpause them
        for (const action in this.animation.actions) {
            this.animation.actions[action].paused = false;
        }

    }

    playNopeAnimation(name: string){
        //find object in model
        const object = this.model.getObjectByName(name) as THREE.Mesh;
        // gsap animation
        gsap.to(object?.rotation, {
            duration: 0.1,
            x : Math.PI * 0.05,
            y: Math.PI * 0.05,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                object.rotation.set(0, 0, 0);
            }
        });
    }

    playAnimation(name:string){
        const actionName = name + "Action";
        if(this.animation.actionsDone[actionName] === true) return;
        const isAllowed = this.puzzleSolving(actionName);
        if(!isAllowed){
            this.playNopeAnimation(name);
            return;
        }
        this.animation.actions[actionName].paused = false;
        this.animation.actionsDone[actionName] = true;
        // this.animation.play(name);
    }

    setModel()
    {
        this.model = this.resource.scene;
        this.model.scale.set(0.5, 0.5, 0.5);
        // this.model.rotation.y = Math.PI;
        this.scene.add(this.model);
    }

    // Hardcoding puzzle cause lazy
    puzzleSolving(name:string):boolean{
        if(name === "CupTopAction"){
            return this.animation.actionsDone["InsidePlasticTopAction"] === true &&
            this.animation.actionsDone["Sphere4Action"] === true;
        }
        if(name === "InsidePlasticTopAction"){
            return this.animation.actionsDone["Vis1Action"] === true && 
            this.animation.actionsDone["Vis2Action"] === true &&
            this.animation.actionsDone["Vis7Action"] === true &&
            this.animation.actionsDone["Vis8Action"] === true &&
            this.animation.actionsDone["PowerWindows1Action"] === true &&
            this.animation.actionsDone["PowerWindows2Action"] === true &&
            this.animation.actionsDone["PowerWindows3Action"] === true &&
            this.animation.actionsDone["PowerWindows4Action"] === true;
        }
        if(name === "Sphere4Action"){
            return this.animation.actionsDone["Vis1Action"] === true && 
            this.animation.actionsDone["Vis2Action"] === true &&
            this.animation.actionsDone["Vis7Action"] === true &&
            this.animation.actionsDone["Vis8Action"] === true &&
            this.animation.actionsDone["Vis1Action"] === true &&
            this.animation.actionsDone["PowerWindows1Action"] === true &&
            this.animation.actionsDone["PowerWindows2Action"] === true &&
            this.animation.actionsDone["PowerWindows3Action"] === true &&
            this.animation.actionsDone["PowerWindows4Action"] === true &&
            this.animation.actionsDone["InsidePlasticTopAction"] === true;
        }
        if(name === "CenterButtonAction"){
            return this.animation.actionsDone["JointAction"] === true && 
            this.animation.actionsDone["RingCircleAction"] === true &&
            this.animation.actionsDone["CristalLightAction"] === true &&
            this.animation.actionsDone["OuterRingAction"] === true;
        }
        if(name === "OuterRingAction"){
            return this.animation.actionsDone["JointAction"] === true && 
            this.animation.actionsDone["RingCircleAction"] === true &&
            this.animation.actionsDone["CristalLightAction"] === true;
        }
        if(name === "CristalLightAction"){
            return this.animation.actionsDone["JointAction"] === true && 
            this.animation.actionsDone["RingCircleAction"] === true; 
        }
        if(name === "CupBottomAction"){
            return this.animation.actionsDone["InsidePlasticBottomAction"] === true &&
            this.animation.actionsDone["Sphere1Action"] === true;
        }
        if(name === "InsidePlasticBottomAction"){
            return this.animation.actionsDone["Vis1Action"] === true && 
            this.animation.actionsDone["Vis3Action"] === true &&
            this.animation.actionsDone["Vis4Action"] === true &&
            this.animation.actionsDone["Vis5Action"] === true &&
            this.animation.actionsDone["Vis6Action"] === true &&
            this.animation.actionsDone["PowerWindows5Action"] === true &&
            this.animation.actionsDone["PowerWindows6Action"] === true &&
            this.animation.actionsDone["PowerWindows7Action"] === true &&
            this.animation.actionsDone["PowerWindows8Action"] === true &&
            this.animation.actionsDone["Sphere2Action"] === true;
        }
        if(name === "Sphere2Action"){
            return this.animation.actionsDone["Sphere3Action"] === true;
        }
        if(name === "Sphere1Action"){
            return this.animation.actionsDone["InsidePlasticBottomAction"] === true;
        }

        return true;
    }

    checkPuzzleStatus(): number{
        let nbDone = 0;
        for (const action in this.animation.actionsDone) {
            if(this.animation.actionsDone[action] === true){
                nbDone ++;
            }
        }

        var size = Object.keys(this.animation.actionsDone).length;
        return nbDone / size;
    }

    update()
    {
        // this.model.rotation.y += 0.01;

        this.animation.mixer.update(this.time.delta * 0.001);
    }   
}