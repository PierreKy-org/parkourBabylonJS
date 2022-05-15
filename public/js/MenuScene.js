export default class MenuScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);

    this.initScene();
  }

  async initScene() {
    let file = await fetch("/getScore");
    let scores = await file.json();

    await this.advancedTexture.parseFromURLAsync("../assets/materials/guilevel.json");
    for (let i = 1; i < 10; i++) {
      let level = this.advancedTexture.getControlByName("level" + i);
      let score = scores[`level_${i}.json`];

      level.textBlock.text = i;
      level.onPointerUpObservable.add(() => {
        window.changeScene(i);
      });
      if (score) {
        level.onPointerEnterObservable.add(() => {
          level.textBlock.text = `timer : ${score.time}\ncollected : ${score.collected}`;
        });
        level.onPointerOutObservable.add(() => {
          level.alpha = 1;
          level.textBlock.text = i;
        });
      }
    }

    //Mode facile
    this.advancedTexture.getControlByName("facile").onIsCheckedChangedObservable.add(() => {
      this.scene.checked = this.advancedTexture.getControlByName("facile").isChecked;
      console.log(this.scene.checked);
    });

    //Bouton help
    this.advancedTexture.getControlByName("help").onPointerUpObservable.add(() => {
      window.changeScene(-3);
    });
  }

  render() {
    this.scene.render();
  }
}
