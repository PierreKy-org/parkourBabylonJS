import Box from "./elements/Box.js";
import Rotator from "./elements/Rotator.js";
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
    var camera = new BABYLON.ArcFollowCamera(
      "FollowCam",
      BABYLON.Tools.ToRadians(270),
      0,
      10,
      this.player.mesh,
      this.scene
    );

    return camera;
  }

  initLight() {
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    return light;
  }

  initGround() {
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 500, height: 20, updtable: false, subdivisions: 1 },
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

    this.inputStates = { left: false, right: false, up: false, down: false };

    const changeInputState = (key, state) => {
      if (key === "ArrowLeft") {
        this.inputStates.left = state;
      } else if (key === "ArrowUp") {
        this.inputStates.up = state;
      } else if (key === "ArrowRight") {
        this.inputStates.right = state;
      } else if (key === "ArrowDown") {
        this.inputStates.down = state;
      }
    };

    window.addEventListener("keydown", (event) => changeInputState(event.key, true), false);

    window.addEventListener("keyup", (event) => changeInputState(event.key, false), false);
  }

  async initLevel() {
    let file = await fetch("./assets/level1.json");
    this.map = await file.json();
    this.map.forEach((line, x) => {
      line.forEach((column, y) => {
        switch (column) {
          case 1:
            new Box(this.map.length - x, y, 0, this);
            break;
          case 2:
            new Rotator(this.map.length - x, y, 0, this);
            break;
          default:
        }
      });
    });
  }

  render() {
    this.player.move();
    this.gui.update();
    this.scene.render();
  }
}
