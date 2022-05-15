export default class HelpScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);

    this.initScene();
  }

  async initScene() {
    await this.advancedTexture.parseFromURLAsync("../assets/gui/help.json");
  }

  changeInputState(key) {
    if (key == "Escape") {
      window.changeScene(-1);
    }
  }

  render() {
    this.scene.render();
  }
}
