import Gui from "./Gui.js";
import Player from "./Player.js";

const physicsPlugin = new BABYLON.CannonJSPlugin();

export default class Scene {
  constructor(engine) {
    this.scene = new BABYLON.Scene(engine);
    this.gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.enablePhysics(this.gravityVector, physicsPlugin);

    this.gui = new Gui(this);

    this.camera = this.initCamera();
    this.light = this.initLight();
    this.ground = this.initGround();

    this.player = new Player(this);

    this.initEvents();

    this.initLevel();
  }

  initCamera() {
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), this.scene);
    camera.inputs.clear();
    camera.checkCollisions = true;

    return camera;
  }

  initLight() {
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    return light;
  }

  initGround() {
    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 100, height: 100, updtable: false, subdivisions: 1 },
      this.scene
    );

    ground.material = new BABYLON.GridMaterial("groundMaterial", this.scene);

    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene
    );
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

  initLevel() {
    fetch("./assets/level1.json")
      .then((res) => res.json())
      .then((json) =>
        json.forEach((line, x) => {
          line.forEach((column, y) => {
            if (column != 0) {
              const pX = json.length - x;
              const pY = y;
              const box = BABYLON.MeshBuilder.CreateBox(`box_${x}_${y}`, { height: 1, width: 1, depth: 1 });
              box.position = new BABYLON.Vector3(pY, pX, 0);
              box.checkCollisions = true;

              box.physicsImpostor = new BABYLON.PhysicsImpostor(
                box,
                BABYLON.PhysicsImpostor.BoxImpostor,
                { mass: 0 },
                this.scene
              );

              box.enableEdgesRendering();
              box.edgesWidth = 4.0;
              box.edgesColor = new BABYLON.Color4(0, 0, 1, 1);

              var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);

              box.material = myMaterial;
            }
          });
        })
      );
  }

  render() {
    this.player.move();
    this.gui.update();
    this.scene.render();
  }
}
