import * as THREE from "three";
import EventEmitter from "./EventEmitter.js";
// @ts-ignore: Unreachable code error
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Howl } from "howler";

export default class Resources extends EventEmitter
{
    sources: any;
    items: any;
    toLoad: number;
    loaded: number;
    loaders: any;
    
    constructor(sources)
    {
        super();

        // Options
        this.sources = sources;

        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders()
    {
        this.loaders = {};
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.fontLoader = new FontLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.loaders.audioLoader = new THREE.AudioLoader();
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === "texture")
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    },
                );
            }
            else if(source.type === "gltfModel")
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    }
                );
            }
            else if(source.type === "font")
            {
                this.loaders.fontLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    },
                    // ( xhr ) => {
                    //     // console.log( ( xhr.loaded / xhr.total * 100 ) + "% loaded" );
                    // },
                    // ( err ) => {
                    //     // console.log( "An error happened" + err );
                    // }
                );
            }
            else if(source.type === "cubeTexture")
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    }
                );
            }
            else if(source.type === "audio")
            {
                const sound = new Howl({
                    src: [source.path],
                    onload: () => {
                        this.sourceLoaded(source, sound);
                    }
                });
            }
            else if(source.type === "audioTex")
            {
                this.loaders.audioLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file);
                    }
                );
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file;

        this.loaded++;

        if(this.loaded === this.toLoad)
        {
            this.trigger("ready");
        }
    }
}