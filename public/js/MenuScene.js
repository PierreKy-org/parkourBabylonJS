export default class MenuScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera(
      "camera1",
      new BABYLON.Vector3(0, 5, -10),
      this.scene
    );
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.initScene();
  }

  async initScene() {
    this.advancedTexture =
      BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "UIMenu",
        true,
        this.scene
      );

    fetch("http://localhost:8000/levels")
      .then((res) => res.json())
      .then((json) => {
        json.forEach((level) => {
          var button = BABYLON.GUI.Button.CreateSimpleButton(level, level);
          button.width = 0.2;
          button.height = "70px";
          button.color = "white";
          button.background = "green";
          //button position
          var pos =
            (parseInt(button.textBlock.text.split("_")[1]) *
              window.innerHeight) /
              json.length -
            window.innerHeight / json.length;
          button.top = pos.toString() + "px";
          button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
          button.horizontalAlignment =
            BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          //attach button1 to advancedTexture
          this.advancedTexture.addControl(button);
          var buttons = this.advancedTexture.getChildren()[0].children;
          buttons.forEach((button) => {
            button.onPointerUpObservable.add(() =>
              window.changeScene(parseInt(button.textBlock.text.split("_")[1]))
            );
          });
        });
      });
  }

  render() {
    this.scene.render();
  }
}
