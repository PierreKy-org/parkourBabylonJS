import Simple from "./elements/Simple.js";
import {
  RotatorFR,
  RotatorFL,
  RotatorBR,
  RotatorBL,
  RotatorLF,
  RotatorLB,
  RotatorRF,
  RotatorRB,
} from "./elements/Rotator.js";
import Checkpoint from "./elements/Checkpoint.js";
import Jump from "./elements/Jump.js";
import { Spikes } from "./elements/Spikes.js";
import Gui from "./Gui.js";
import Player from "./Player.js";
import Collectible from "./elements/Collectible.js";
import AssetsManager from "./AssetManager.js";

const physicsPlugin = new BABYLON.CannonJSPlugin();

export default class Scene {
  constructor(assets) {
    this.scene = new BABYLON.Scene(window.engine);
    this.assetsManager = new AssetsManager(this.scene, assets);
  }

  initScene() {
    this.gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.enablePhysics(this.gravityVector, physicsPlugin);

    this.gui = new Gui(this);

    this.player = new Player(this);
    this.camera = this.initCamera();
    this.light = this.initLight();
    this.ground = this.initGround();
    this.initFog();
    this.initSkyBox();

    this.collected = 0;
    this.pause = false;

    this.initEvents();

    (async () => {
      await this.initLevel();
      this.gui.map(this);
    })();
  }

  initCamera() {
    return new BABYLON.ArcFollowCamera("FollowCam", BABYLON.Tools.ToRadians(270), 57, 15, this.player.mesh, this.scene);
  }

  initLight() {
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, -1), this.scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    return light;
  }

  initSkyBox() {
    const background = BABYLON.MeshBuilder.CreatePlane("background", { height: 200, width: 3000 }, this.scene);
    background.position.z = 400;

    const floor = BABYLON.MeshBuilder.CreatePlane("floor", { height: 1000, width: 1000 }, this.scene);
    floor.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    floor.position.y = -10;
    floor.material = new BABYLON.StandardMaterial("floorMaterial", this.scene);
    floor.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
  }

  initFog() {
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogColor = new BABYLON.Color3(0.79, 0.34, 0.04);
    this.scene.fogDensity = 0.01;
  }

  initGround() {
    var mapSubX = 1000;
    var mapSubZ = 1000;
    var mapData = this.getNoiseMap(mapSubX, mapSubZ, 0.03, 5);

    var ground = new BABYLON.DynamicTerrain(
      "ground",
      {
        mapData: mapData,
        mapSubX: mapSubX,
        mapSubZ: mapSubZ,
        terrainSub: 150,
      },
      this.scene
    );
    ground.mesh.material = new BABYLON.StandardMaterial("groundMaterial", this.scene);
    ground.mesh.material.diffuseColor = new BABYLON.Color3(1, 0.84, 0);
    ground.mesh.material.alpha = 0.8;
    ground.mesh.material.wireframe = true;

    return ground;
  }

  getNoiseMap(mapSubX, mapSubZ, scale, amp) {
    noise.seed(Math.random());
    var mapData = new Float32Array(mapSubX * mapSubZ * 3);

    for (var l = 0; l < mapSubZ; l++) {
      for (var w = 0; w < mapSubX; w++) {
        var x = (w - mapSubX * 0.5) * 2.0;
        var z = (l - mapSubZ * 0.5) * 2.0;
        var y = noise.simplex2(x * scale, z * scale) * amp - amp;

        mapData[3 * (l * mapSubX + w)] = x;
        mapData[3 * (l * mapSubX + w) + 1] = y;
        mapData[3 * (l * mapSubX + w) + 2] = z;
      }
    }
    return mapData;
  }

  initEvents() {
    this.inputStates = { left: false, right: false, up: false, down: false, r: false, escape: false };

    const changeInputState = (key, state) => {
      if (key === "ArrowLeft") {
        this.inputStates.left = state;
      } else if (key === "ArrowUp") {
        this.inputStates.up = state;
      } else if (key === "ArrowRight") {
        this.inputStates.right = state;
      } else if (key === "ArrowDown") {
        this.inputStates.down = state;
      } else if (key === "r") {
        this.inputStates.r = state;
      } else if (key === "Escape") {
        this.inputStates.escape = state;
      }
    };

    window.addEventListener("keydown", (event) => changeInputState(event.key, true), false);

    window.addEventListener("keyup", (event) => changeInputState(event.key, false), false);
  }

  async initLevel() {
    let file = await fetch("./assets/level1.json");
    this.map = await file.json();

    this.map.forEach((plan) => {
      plan.map.forEach((line, x) => {
        line.forEach((column, y) => {
          const offset = {
            front: { x: plan.origin.x + x, y: plan.origin.y + y, z: plan.origin.z },
            right: { x: plan.origin.x, y: plan.origin.y + y, z: plan.origin.z - x },
            back: { x: plan.origin.x - x, y: plan.origin.y + y, z: plan.origin.z },
            left: { x: plan.origin.x, y: plan.origin.y + y, z: plan.origin.z + x },
          };

          const position = offset[plan.orientation];

          let callBacks = [
            (zero) => {},
            (one) => new Simple(position.x, position.y, position.z, this),
            (two) => new RotatorFR(position.x, position.y, position.z, this),
            (three) => new RotatorFL(position.x, position.y, position.z, this),
            (four) => new RotatorBR(position.x, position.y, position.z, this),
            (five) => new RotatorBL(position.x, position.y, position.z, this),
            (six) => new RotatorLF(position.x, position.y, position.z, this),
            (seven) => new RotatorLB(position.x, position.y, position.z, this),
            (eight) => new RotatorRF(position.x, position.y, position.z, this),
            (nine) => new RotatorRB(position.x, position.y, position.z, this),
            (ten) => new Jump(position.x, position.y, position.z, this),
            (eleven) => new Checkpoint(position.x, position.y, position.z, this),
            (twelve) => new Spikes(position.x, position.y, position.z, this),
            (thirteen) => new Collectible(position.x, position.y, position.z, this),
          ];

          callBacks[column]();
        });
      });
    });
  }

  render() {
    //TODO : escape peut etre maintenu et le jeu se saccade
    if (this.inputStates.escape) {
      if (!this.pause) {
        this.player.mesh.physicsImpostor.mass = 0;
        setTimeout(() => (this.pause = true), 200);
      } else {
        this.player.mesh.physicsImpostor.mass = 1;
        setTimeout(() => (this.pause = false), 100);
      }
    }
    if (!this.pause) {
      this.player.move();
    }

    if (
      this.player.mesh.position.y <=
      this.ground.getHeightFromMap(this.player.mesh.position.x, this.player.mesh.position.z)
    ) {
      this.player.respawn();
    }

    this.ground.mesh.position.x -= 0.05;

    this.gui.update();
    this.scene.render();
  }
}
