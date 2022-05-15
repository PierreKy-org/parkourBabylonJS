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
import { SpikesBottom, SpikesTop, SpikesFront, SpikesBack, SpikesLeft, SpikesRight } from "./elements/Spikes.js";
import Player from "./Player.js";
import Collectible from "./elements/Collectible.js";
import AssetsManager from "./AssetManager.js";
import End from "./elements/End.js";
import DecreaseSpeed from "./elements/DecreaseSpeed.js";
import IncreaseSpeed from "./elements/IncreaseSpeed.js";
import { XEnemy, YEnemy, ZEnemy } from "./elements/Enemy.js";

const physicsPlugin = new BABYLON.CannonJSPlugin();

export default class Scene {
  constructor(file) {
    this.scene = new BABYLON.Scene(window.engine);
    this.file = file;
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("Game GUI", true, this.scene);

    this.initScene();
  }

  async initScene() {
    window.engine.displayLoadingUI();

    let file = await fetch(`./assets/levels/${this.file}`);
    let json = await file.json();

    this.assetsManager = new AssetsManager(this.scene, json.assets);
    await this.assetsManager.load();

    this.gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    this.scene.enablePhysics(this.gravityVector, physicsPlugin);

    this.player = new Player(this);
    this.camera = this.initCamera();
    this.light = this.initLight();
    this.ground = this.initGround();
    this.initGui();
    this.initSkyBox();

    this.collectable = 0;
    this.collected = 0;

    this.player.lastCheckPointData.position = new BABYLON.Vector3(json.spawn.x, json.spawn.y, json.spawn.z);

    this.initEvents();

    this.initLevel(json.level);
    this.initFog();
    this.player.spawn();

    this.assetsManager.Audio["music"].play();
    this.assetsManager.Audio["music"].setVolume(0.3);

    this.loaded = true;
    window.engine.hideLoadingUI();

    this.startTimer = Date.now();
  }

  initCamera() {
    return new BABYLON.ArcFollowCamera("FollowCam", BABYLON.Tools.ToRadians(270), 57, 15, this.player.mesh, this.scene);
  }

  initLight() {
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, -1), this.scene);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    return light;
  }

  initGui() {
    this.advancedTexture.parseContent(this.assetsManager.Guis["Game"]);
    let gui = this.advancedTexture.getChildren()[0]._children[0];
    let fps = gui._children[0]._children[0];

    let death = gui._children[1]._children[0]._children[0]._children[0];
    let timer = gui._children[1]._children[0]._children[1]._children[0];

    this.menu = gui._children[2]._children[0];
    let leave = this.menu._children[0]._children[0];
    let resume = this.menu._children[1]._children[0];

    let sound = this.menu._children[2]._children[0];
    let musicButton = sound._children[0]._children[0];
    let musicIcon = sound._children[1]._children[0];

    musicButton.isChecked = true;

    this.updateGui = () => {
      fps.text = `${window.engine.getFps().toFixed()}FPS`;
      timer.text = this.getTimer();
      death.text = `${this.player.deaths} × 💀`;
    };

    this.menu.isVisible = false;

    resume.onPointerClickObservable.add(() => {
      this.menu.isVisible = false;
      this.resume();
    });

    leave.onPointerClickObservable.add(() => {
      window.changeScene(-1);
    });

    musicButton.onIsCheckedChangedObservable.add((value) => {
      musicIcon.text = value ? "🔊" : "🔈";

      if (value) {
        this.assetsManager.Audio["music"].setVolume(0.3);
      } else {
        this.assetsManager.Audio["music"].setVolume(0);
      }
    });
  }

  initSkyBox() {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this.scene);
    skybox.material = new BABYLON.StandardMaterial("skyBox", this.scene);
    skybox.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
    skybox.position.y = 490;
    skybox.material.backFaceCulling = false;
    skybox.material.disableLighting = true;
    skybox.isPickable = false;
  }

  initFog() {
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.01;

    let colors = {
      front: new BABYLON.Color3(0.79, 0.34, 0.04),
      right: new BABYLON.Color3(0, 0.33, 0.02),
      back: new BABYLON.Color3(0, 0.43, 0.51),
      left: new BABYLON.Color3(0.43, 0, 0.34),
    };

    this.changeFogColor = () => {
      this.scene.fogColor = colors[this.player.orientation];
    };
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

    ground.isPickable = false;
    ground._terrain.isPickable = false;

    return ground;
  }

  getTimer() {
    let duration = Date.now() - this.startTimer;
    return `${new Date(duration).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]}:${(duration % 1000)
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
            this.resume();
            this.menu.isVisible = false;
          } else {
            this.menu.isVisible = true;
            this.pausex();
          }
        }
      } else if (key === " ") {
        this.inputStates.space = state;
      }
    };

    window.addEventListener("keydown", (event) => changeInputState(event.key, true), false);

    window.addEventListener("keyup", (event) => changeInputState(event.key, false), false);
  }

  initLevel(level) {
    level.forEach((plan) => {
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

          if (!this.player.orientation) {
            this.player.orientation = plan.orientation;
          }
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
            (twelve) => new XEnemy(position.x, position.y, position.z, this),
            (thirteen) => new Collectible(position.x, position.y, position.z, this),
            (fourteen) => new End(position.x, position.y, position.z, this.file, this),
            (fifthteen) => new SpikesBottom(position.x, position.y, position.z, this),
            (sixteen) => new SpikesTop(position.x, position.y, position.z, this),
            (seventeen) => new SpikesFront(position.x, position.y, position.z, this),
            (eigthteen) => new SpikesBack(position.x, position.y, position.z, this),
            (nineteeen) => new SpikesLeft(position.x, position.y, position.z, this),
            (twenty) => new SpikesRight(position.x, position.y, position.z, this),
            (twentyone) => new DecreaseSpeed(position.x, position.y, position.z, this),
            (twentytwo) => new IncreaseSpeed(position.x, position.y, position.z, this),
            (twentythree) => new YEnemy(position.x, position.y, position.z, this),
            (twentyfour) => new ZEnemy(position.x, position.y, position.z, this),
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
      this.camera.oldAlpha = this.camera.alpha;
      if (Collectible.model) {
        Collectible.model.meshes[1].renderOutline = true;
      }
    } else {
      this.resume();
      this.camera.radius = 15;
      this.camera.alpha = this.camera.oldAlpha;
      if (Collectible.model) {
        Collectible.model.meshes[1].renderOutline = false;
      }
    }
  }

  pausex() {
    this.player.indicator.setEnabled(false);
    this.player.oldVelocity = {
      angular: this.player.mesh.physicsImpostor.getAngularVelocity(),
      linear: this.player.mesh.physicsImpostor.getLinearVelocity(),
      speed: this.player.speed,
    };
    this.player.mesh.physicsImpostor.sleep();
  }

  resume() {
    this.player.indicator.setEnabled(true);
    this.player.mesh.physicsImpostor.wakeUp();

    this.player.mesh.physicsImpostor.setAngularVelocity(this.player.oldVelocity.angular);
    this.player.mesh.physicsImpostor.setLinearVelocity(this.player.oldVelocity.linear);
  }

  render() {
    if (this.loaded) {
      if (
        this.player.mesh.position.y <=
        this.ground.getHeightFromMap(this.player.mesh.position.x, this.player.mesh.position.z)
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
