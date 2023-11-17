import Experience from "./Experience.js";

export default class App {
    
    canvas: HTMLCanvasElement;
    experience: Experience | null = null;

    constructor({ canvas }) {
        this.canvas = canvas;
        this.experience = new Experience();
    }
  
    destroy() {
        if (this.experience) this.experience.destroy();
        this.experience = null;
    }
  
}

const canvas = document.querySelector("canvas");
// eslint-disable-next-line no-unused-vars
const app = new App({
    canvas
});