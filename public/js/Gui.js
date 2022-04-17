export default class Gui {
  constructor(scene) {
    this.scene = scene;
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.debug = new BABYLON.GUI.TextBlock();
    this.debug.color = "white";
    this.debug.top = "-350px";
    this.debug.fontSize = 24;

    this.advancedTexture.addControl(this.debug);
  }

  update() {
    let playerPos = this.scene.player.mesh.position;
    let lv = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.debug.text = `x:${playerPos.x.toFixed(2)}\ny:${playerPos.y.toFixed(2)}\nz:${playerPos.z.toFixed(
      2
    )}\nv:${this.scene.player.speed?.toFixed(2)}\nLinear Velocity  x:${lv.x.toFixed(2)}, y: ${(lv.y + 0.001).toFixed(
      2
    )}, z: ${lv.z.toFixed(2)}\nAngular Velocity  x:${av.x.toFixed(2)}, y: ${av.y.toFixed(2)}, z: ${av.z.toFixed(2)}`;
  }

  map(scene) {
    if (scene.map) {
      let width = 10;
      let offsetX = window.innerWidth / 2;
      let offsetY = window.innerHeight / 2;
      let lastX = 1;
      scene.map.forEach((plan) => {
        plan.map.forEach((line, x) => {
          line.forEach((column, y) => {
            if (column != 0) {
              var rect = new BABYLON.GUI.Rectangle();
              rect.width = `${width}px`;
              rect.height = `${width}px`;
              rect.left = (x + lastX) * width - offsetX;
              rect.top = (line.length - y) * width - offsetY;
              rect.background = this.getElementColor(column);
              this.advancedTexture.addControl(rect);
            }
          });
        });
        lastX += plan.map.length;
      });
    }
  }

  getElementColor(value) {
    switch (value) {
      case 1:
        return "orange";
      case 2:
        return "green";
      default:
        return "blue";
    }
  }
}
