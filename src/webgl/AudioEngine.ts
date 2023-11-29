import {Howl, Howler} from "howler";
import Experience from "./Experience";

export default class AudioEngine
{

    experience: Experience;
    resources: any;
    sound: Howl;
    wrongSound: Howl;

    constructor()
    {
        // Setup the new Howl.

        // Change global volume.
        Howler.volume(0.1);

        this.experience = Experience.getInstance();

        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on("ready", () => {
            this.init();
        });
    }

    init()
    {
        this.sound = this.resources.items.ambientSound;
        this.sound.play();

        this.wrongSound = this.resources.items.wrongSound;
    }

    playWrongSound()
    {
        if(this.wrongSound.playing()) this.wrongSound.stop();
        this.wrongSound.play();
    }

    playSuccessSound()
    {
        this.sound.stop();
        this.sound = this.resources.items.successSound;
        this.sound.play();
    }

    destroy()
    {
        this.sound.stop();
        
    }
}

