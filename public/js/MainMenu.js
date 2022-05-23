import { getDynamicTerrain } from "./Noise.js";

export default class MainMenu {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);

    this.initBackground();

    this.click = new BABYLON.Sound("mouseclick", "../assets/audio/click.wav", this.scene);
    this.music = new BABYLON.Sound("music", "../assets/audio/menu.wav", this.scene, null, {
      loop: true,
      autoplay: true,
    });

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);

    this.initStartGui();
  }

  initBackground() {
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());

    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.01;
    this.scene.fogColor = new BABYLON.Color3(1, 0.75, 0.85);

    this.ground = getDynamicTerrain(1000, 1000, 0.1, 2.5, this.scene);
    this.ground.mesh.material = new BABYLON.StandardMaterial("groundMaterial", this.scene);
    this.ground.mesh.material.alpha = 0.9;
  }

  async initStartGui() {
    this.state = "START";
    this.page = 0;
    await this.advancedTexture.parseFromURLAsync("../assets/gui/start.json");
    let start = this.advancedTexture.getControlByName("Start");

    var animationWidth = new BABYLON.Animation(
      "start",
      "_scaleX",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    var animationHeigth = new BABYLON.Animation(
      "start",
      "_scaleY",
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    var keys = [
      {
        frame: 0,
        value: 1,
      },
      {
        frame: 30,
        value: 1.2,
      },
      {
        frame: 60,
        value: 1,
      },
    ];
    animationWidth.setKeys(keys);
    animationHeigth.setKeys(keys);

    this.scene.beginDirectAnimation(start, [animationWidth, animationHeigth], 0, 60, true);

    start.onPointerUpObservable.add(() => {
      BABYLON.Engine.audioEngine.unlock();
      this.click.play();
      window.canvas.requestFullscreen();
      this.initLevelsGui();
    });

    let file = await fetch("/levels");
    this.levels = await file.json();
  }

  async initLevelsGui() {
    this.state = "LEVELS";
    await this.advancedTexture.parseFromURLAsync("../assets/gui/levels.json");

    let help = this.advancedTexture.getControlByName("Help");
    help.onPointerUpObservable.add(async () => {
      this.state = "HELP";
      this.click.play();
      await this.advancedTexture.parseFromURLAsync("../assets/gui/help.json");
    });

    let easy = this.advancedTexture.getControlByName("Easy Mode");
    easy.onPointerUpObservable.add(() => {
      this.click.play();
      window.easyMode = easy._isChecked;
    });

    this.prev = this.advancedTexture.getControlByName("Prev");
    this.prev.onPointerUpObservable.add(() => {
      this.click.play();
      this.page--;
      this.updateButtons();
    });

    this.next = this.advancedTexture.getControlByName("Next");
    this.next.onPointerUpObservable.add(() => {
      this.click.play();
      this.page++;
      this.updateButtons();
    });

    this.initButtons();
  }

  initButtons() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let button = this.advancedTexture.getControlByName(`${i}_${j}`);
        button.num = i * 3 + (j + 1) + this.page * 9;

        button.onPointerEnterObservable.add(() => this.showScoreButton(button));

        button.onPointerOutObservable.add(() => this.hideScoreButton(button));

        button.onPointerUpObservable.add(() => {
          this.click.play();
          this.hideScoreButton(button);
          window.changeScene(button.num);
        });
      }
    }
    this.updateArrows();
  }

  hideScoreButton(button) {
    let score = window.scores[`level_${button.num}.json`];
    if (score) {
      button.textBlock.text = `${button.num}`;
      button.textBlock.fontSize = button.oldData.fontSize;
      button.textBlock.outlineWidth = button.oldData.outlineWidth;
      button.background = button.oldData.background;
    }
  }

  showScoreButton(button) {
    let score = window.scores[`level_${button.num}.json`];
    if (score) {
      button.oldData = {
        fontSize: button.textBlock.fontSize,
        outlineWidth: button.textBlock.outlineWidth,
        background: button.background,
      };
      button.textBlock.text = `Timer : ${score.time}\nCollected :\n${score.collected}`;
      button.textBlock.fontSize = "15%";
      button.textBlock.outlineWidth = "3";
      button.background = "#707070FF";
    }
  }

  updateButtons() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let button = this.advancedTexture.getControlByName(`${i}_${j}`);
        button.num = (i + 1) * (j + 1) + this.page * 9;
        button.textBlock.text = `${button.num}`;
        this.showElement(button, button.num <= this.levels.length);
      }
    }
    this.updateArrows();
  }

  updateArrows() {
    if (this.page == 0) {
      this.showElement(this.prev, false);
    }
    if (this.page == 1) {
      this.showElement(this.prev, true);
    }
    if (this.page == this.levels.length % 9) {
      this.showElement(this.next, false);
    } else {
      this.showElement(this.next, true);
    }
  }

  showElement(element, hide) {
    element.isEnabled = hide;
    element.isVisible = hide;
  }

  async changeInputState(key) {
    if (this.state == "HELP") {
      if (key == "Escape") {
        this.initLevelsGui();
      }
    }
  }

  pause() {
    this.music.stop();
    this.scene.detachControl();
  }

  resume() {
    this.music.play();
    this.scene.attachControl(true, true, true);
  }

  render() {
    this.ground.mesh.position.z -= 0.05;
    this.scene.render();
  }
}
