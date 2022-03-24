import Simple from "./elements/Simple.js";
import Rotator from "./elements/Rotator.js";
import Jump from "./elements/Jump.js";
import Camera from "./Camera.js";
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
    this.camera = new Camera(this);
    this.light = this.initLight();
    this.ground = this.initGround();
    //this.skybox = this.initSkyBox();

    this.initEvents();

    (async () => {
      await this.initLevel();
      this.gui.map(this);
    })();
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

  initSkyBox() {
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 10.0 }, this.scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
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
            new Simple(this.map.length - x, y, 0, this);
            break;
          case 2:
            new Rotator(this.map.length - x, y, 0, this);
            break;
          case 3:
            new Jump(this.map.length - x, y, 0, this);
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
