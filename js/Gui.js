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
    let lv = this.scene.player.head.physicsImpostor.getLinearVelocity();
    let av = this.scene.player.head.physicsImpostor.getAngularVelocity();
    this.position.text = `x:${playerPos.x.toFixed(2)}\ny:${playerPos.y.toFixed(2)}\nz:${playerPos.z.toFixed(
      2
    )}\nv:${this.scene.player.speed.toFixed(2)}\nLinear Velocity  x:${lv.x.toFixed(2)}, y: ${lv.y.toFixed(
      2
    )}, z: ${lv.z.toFixed(2)}\nAngular Velocity  x:${av.x.toFixed(2)}, y: ${av.y.toFixed(2)}, z: ${av.z.toFixed(2)}`;
  }

  map(scene) {
    if (scene.map) {
      let width = 10;
      let offsetX = window.innerWidth / 2 - width * 2;
      let offsetY = window.innerHeight / 2 - width * 2;
      scene.map.forEach((line, x) => {
        line.forEach((column, y) => {
          if (column != 0) {
            var rect = new BABYLON.GUI.Rectangle();
            rect.width = `${width}px`;
            rect.height = `${width}px`;
            rect.left = y * width - offsetX;
            rect.top = -(this.map.length - x) * width - offsetY;
            rect.background = "green";
            this.advancedTexture.addControl(rect);
          }
        });
      });
    }
  }
}
