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
import {
  SpikesBottom,
  SpikesTop,
  SpikesFront,
  SpikesBack,
  SpikesLeft,
  SpikesRight,
} from "./elements/Spikes.js";
import Player from "./Player.js";
import Collectible from "./elements/Collectible.js";
import AssetsManager from "./AssetManager.js";
import End from "./elements/End.js";
import DecreaseSpeed from "./elements/DecreaseSpeed.js";
import IncreaseSpeed from "./elements/IncreaseSpeed.js";

const physicsPlugin = new BABYLON.CannonJSPlugin();

export default class Scene {
  constructor(assets, map) {
    this.scene = new BABYLON.Scene(window.engine);
    this.map = map;
    this.assetsManager = new AssetsManager(this.scene, assets);

    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "Game GUI",
        true,
        this.scene
      );

    this.initScene();
  }

  async initScene() {
    window.engine.displayLoadingUI();
    await this.assetsManager.load();

    this.gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.enablePhysics(this.gravityVector, physicsPlugin);

    this.player = new Player(this);
    this.camera = this.initCamera();
    this.light = this.initLight();
    this.ground = this.initGround();
    this.initGui();
    this.initFog();
    this.initSkyBox();

    this.collectable = 0;
    this.collected = 0;

    this.initEvents();

    await this.initLevel();
    this.player.spawn();

    this.assetsManager.Audio["music"].play();
    this.assetsManager.Audio["music"].setVolume(0.3);

    this.loaded = true;
    window.engine.hideLoadingUI();

    this.startTimer = Date.now();
  }

  initCamera() {
    return new BABYLON.ArcFollowCamera(
      "FollowCam",
      BABYLON.Tools.ToRadians(270),
      57,
      15,
      this.player.mesh,
      this.scene
    );
  }

  initLight() {
    var light = new BABYLON.HemisphericLight(
      "hemiLight",
      new BABYLON.Vector3(0, 1, -1),
      this.scene
    );
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    return light;
  }

  initGui() {
    this.advancedTexture.parseContent(this.assetsManager.Textures["Game"]);
    let gui = this.advancedTexture.getChildren()[0]._children[0];
    let fps = gui._children[0]._children[0];

    let death = gui._children[1]._children[0]._children[0]._children[0];
    let timer = gui._children[1]._children[0]._children[1]._children[0];

    this.menu = gui._children[2]._children[0];
    let leave = this.menu._children[0]._children[0];
    let resume = this.menu._children[1]._children[0];

    this.updateGui = () => {
      fps.text = `${window.engine.getFps().toFixed()}FPS`;
      timer.text = this.getTimer();
      death.text = `${this.player.deaths} × 💀`;
    };

    this.menu.isVisible = false;

    resume.onPointerClickObservable.add(() => {
      this.menu._isVisible = false;
    });

    leave.onPointerClickObservable.add(() => {
      window.changeScene(0);
    });
  }

  initSkyBox() {
    const skybox = BABYLON.MeshBuilder.CreateBox(
      "skyBox",
      { size: 1000.0 },
      this.scene
    );
    skybox.material = new BABYLON.StandardMaterial("skyBox", this.scene);
    skybox.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    skybox.position.y = 490;
    skybox.material.backFaceCulling = false;
    skybox.material.disableLighting = true;
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
    ground.mesh.material = new BABYLON.StandardMaterial(
      "groundMaterial",
      this.scene
    );
    ground.mesh.material.diffuseColor = new BABYLON.Color3(1, 0.84, 0);
    ground.mesh.material.alpha = 0.8;
    ground.mesh.material.wireframe = true;

    return ground;
  }

  getTimer() {
    let duration = Date.now() - this.startTimer;
    return `${new Date(duration).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]}:${(
      duration % 1000
    )
      .toString()
      .padStart(3, "0")}`;
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
    this.inputStates = {};

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
        if (state) {
          if (this.menu.isVisible) {
            this.menu.isVisible = false;
          } else {
            this.menu.isVisible = true;
          }
        }
      } else if (key === " ") {
        this.inputStates.space = state;
      }
    };

    window.addEventListener(
      "keydown",
      (event) => changeInputState(event.key, true),
      false
    );

    window.addEventListener(
      "keyup",
      (event) => changeInputState(event.key, false),
      false
    );
  }

  async initLevel() {
    let file = await fetch(`./assets/levels/${this.map}`);
    this.level = await file.json();

    this.level.forEach((plan) => {
      plan.map.forEach((line, x) => {
        for (let y = line.length - 1; y >= 0; y--) {
          let column = line[y];
          const offset = {
            front: {
              x: plan.origin.x + x,
              y: plan.origin.y + y,
              z: plan.origin.z,
            },
            right: {
              x: plan.origin.x,
              y: plan.origin.y + y,
              z: plan.origin.z - x,
            },
            back: {
              x: plan.origin.x - x,
              y: plan.origin.y + y,
              z: plan.origin.z,
            },
            left: {
              x: plan.origin.x,
              y: plan.origin.y + y,
              z: plan.origin.z + x,
            },
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
            (eleven) =>
              new Checkpoint(position.x, position.y, position.z, this),
            (twelve) => {},
            (thirteen) =>
              new Collectible(position.x, position.y, position.z, this),
            (fourteen) => new End(position.x, position.y, position.z, this),
            (fifthteen) =>
              new SpikesBottom(position.x, position.y, position.z, this),
            (sixteen) =>
              new SpikesTop(position.x, position.y, position.z, this),
            (seventeen) =>
              new SpikesFront(position.x, position.y, position.z, this),
            (eigthteen) =>
              new SpikesBack(position.x, position.y, position.z, this),
            (nineteeen) =>
              new SpikesLeft(position.x, position.y, position.z, this),
            (twenty) =>
              new SpikesRight(position.x, position.y, position.z, this),
            (twentyone) =>
              new DecreaseSpeed(position.x, position.y, position.z, this),
            (twentytwo) =>
              new IncreaseSpeed(position.x, position.y, position.z, this),
          ];

          callBacks[column]();
        }
      });
    });
  }

  distanceCamera(on) {
    if (on) {
      this.pausex();
      this.camera.radius = 100;
      if (Collectible.model) {
        Collectible.model.meshes[1].renderOutline = true;
      }
    } else {
      this.resume();
      this.camera.radius = 15;
      if (Collectible.model) {
        Collectible.model.meshes[1].renderOutline = false;
      }
    }
  }

  pausex() {
    this.player.oldVelocity = {
      angular: this.player.mesh.physicsImpostor.getAngularVelocity(),
      linear: this.player.mesh.physicsImpostor.getLinearVelocity(),
      speed: this.player.speed,
    };
    this.player.mesh.physicsImpostor.sleep();
  }

  resume() {
    this.player.mesh.physicsImpostor.wakeUp();

    this.player.mesh.physicsImpostor.setAngularVelocity(
      this.player.oldVelocity.angular
    );
    this.player.mesh.physicsImpostor.setLinearVelocity(
      this.player.oldVelocity.linear
    );
  }

  render() {
    if (this.loaded) {
      if (
        this.player.mesh.position.y <=
        this.ground.getHeightFromMap(
          this.player.mesh.position.x,
          this.player.mesh.position.z
        )
      ) {
        this.assetsManager.Audio["hit"].play();
        this.player.respawn();
      }

      this.ground.mesh.position.x -= 0.05;

      this.updateGui();
      this.scene.render();
    }
  }
}
