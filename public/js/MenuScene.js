export default class MenuScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.goToGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
    this.button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Game");
    this.button1.width = "150px";
    this.button1.height = "40px";
    this.button1.color = "white";
    this.button1.alpha = 0.6;

    this.button1.cornerRadius = 20;
    this.button1.background = "green";
    
    this.goToGame.addControl(this.button1);
  }

  render() {
    console.log("render");
    this.scene.render();
  }
}
