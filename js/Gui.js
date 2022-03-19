export default class Gui {
  constructor(scene) {
    this.scene = scene;
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.position = new BABYLON.GUI.TextBlock();
    this.position.text = "Hello world";
    this.position.color = "white";
    this.position.top = "-350px";
    this.position.fontSize = 24;

    this.advancedTexture.addControl(this.position);
  }

  update() {
    let playerPos = this.scene.player.player.position;
    this.position.text = `x:${playerPos.x.toFixed(2)}\ny:${playerPos.y.toFixed(2)}\nz:${playerPos.z.toFixed(
      2
    )}\nv:${this.scene.player.speed.toFixed(2)}`;
  }
}
