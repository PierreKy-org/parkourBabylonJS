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
import Gui from "./Gui.js";
import Player from "./Player.js";

const physicsPlugin = new BABYLON.CannonJSPlugin();

export default class Scene {
  constructor(engine) {
    this.scene = new BABYLON.Scene(engine);
    this.gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.enablePhysics(this.gravityVector, physicsPlugin);

    this.gui = new Gui(this);

    this.player = new Player(this);
    this.camera = this.initCamera();
    this.light = this.initLight();
    this.ground = this.initGround();

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
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 1));
    light.diffuse = new BABYLON.Color3(0.5, 0, 0);
    light.specular = new BABYLON.Color3(0, 0, 0.5);
    light.groundColor = new BABYLON.Color3(0, 0, 0.28);
    return light;
  }

  initGround() {
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 500, height: 500, updtable: false, subdivisions: 1 },
      this.scene
    );

    ground.material = new BABYLON.GridMaterial("groundMaterial", this.scene);

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene
    );
    ground.reIntegrateRotationIntoRotationQuaternion = true;

    ground.checkCollisions = true;

    return ground;
  }

  initEvents() {
    this.scene.onPointerPick = function (evt, pickInfo) {
      pickInfo.pickedMesh.material.emissiveColor = new BABYLON.Color3(250, 253, 0);
    };

    this.inputStates = { left: false, right: false, up: false, down: false, r: false };

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
          ];

          callBacks[column]();
        });
      });
    });
  }

  render() {
    this.player.move();
    this.gui.update();
    this.scene.render();
  }
}
