export default class PresentationScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.ground = this.initGround();
    this.initFog();
    this.sound = new BABYLON.Sound("mouseclick", "../assets/audio/mouse.mp3", this.scene);

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);
    this.initScene();
    
  }

  async initScene() {
    await this.advancedTexture.parseFromURLAsync("../assets/gui/guiPresentation.json");

    var animationHideText = new BABYLON.Animation(
      "myAnimation",
      "width",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    var keys = [];

    keys.push({
      frame: 0,
      value: 0.1,
    });

    keys.push({
      frame: 30,
      value: 0.07,
    });
    keys.push({
      frame: 60,
      value: 0.1,
    });

    var animationshowText = new BABYLON.Animation(
      "myAnimation",
      "height",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    var keyss = [];

    keyss.push({
      frame: 0,
      value: 0.04,
    });

    keyss.push({
      frame: 30,
      value: 0.03,
    });
    keyss.push({
      frame: 60,
      value: 0.04,
    });
    animationshowText.setKeys(keyss);
    animationHideText.setKeys(keys);
    this.advancedTexture.getControlByName("bouton").animations = [];
    this.scene.beginDirectAnimation(
      this.advancedTexture.getControlByName("bouton"),
      [animationHideText, animationshowText],
      0,
      100,
      true
    );
    //Mode facile
    this.advancedTexture.getControlByName("bouton").onPointerUpObservable.add(() => {
      this.sound.play()
      this.initSceneLevel();
    });
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
    var mapData = this.getNoiseMap(mapSubX, mapSubZ, 0.03, 10);

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

  async initSceneLevel() {
    let file = await fetch("/getScore");
    let scores = await file.json();
    await this.advancedTexture.parseFromURLAsync("../assets/gui/guilevel.json");
    for (let i = 1; i < 10; i++) {
      let level = this.advancedTexture.getControlByName("level" + i);
      let score = scores[`level_${i}.json`];

      level.textBlock.text = i;
      level.onPointerUpObservable.add(() => {
        this.sound.play()
        window.changeScene(i + 1);
      });
      if (score) {
        level.onPointerEnterObservable.add(() => {
          level.textBlock.text = `timer : ${score.time}\ncollected : ${score.collected}`;
          level.background = "#707070FF";
        });
        level.onPointerOutObservable.add(() => {
          level.background = "#333333FF";
          level.textBlock.text = i;
        });
      }
    }

    //Mode facile
    this.advancedTexture.getControlByName("facile").onIsCheckedChangedObservable.add(() => {
      this.scene.checked = this.advancedTexture.getControlByName("facile").isChecked;
      this.sound.play()
      console.log(this.scene.checked);
    });

    //Bouton help
    this.advancedTexture.getControlByName("help").onPointerUpObservable.add(() => {
      this.sound.play()
      window.changeScene(-2);
    });
  }
  render() {
    this.ground.mesh.position.x -= 0.05;
    this.scene.render();
  }
}
