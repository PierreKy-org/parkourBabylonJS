export default class MenuScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.initScene();
  }

  async initScene() {
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
    await this.advancedTexture.parseFromSnippetAsync("#IW7N4K");

    var buttons = this.advancedTexture.getChildren()[0].children;
    buttons.forEach((button) => {
      button.onPointerUpObservable.add(() => window.changeScene(button.textBlock.text.split(" ")[1]));
    });
  }

  render() {
    this.scene.render();
  }
}
