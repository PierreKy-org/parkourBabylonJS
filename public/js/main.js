import Scene from "./Scene.js";
let canvas;
let engine;
window.onload = () => {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);

  var createScene0 = function () {
    var scene0 = new BABYLON.Scene(engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene0);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    let goToGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene0);
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Game");
    button1.width = "150px";
    button1.height = "40px";
    button1.color = "white";
    button1.alpha = 0.6;

    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function () {
      clicks++;
    });
    goToGame.addControl(button1);

    return scene0;
  };

  var scene0 = createScene0();
  var scene1 = new Scene(engine);

  var clicks = 0;
  var showScene = 0;

  engine.runRenderLoop(() => {
    showScene = clicks % 2;
    switch (showScene) {
      case 0:
        scene0.render();
        break;
      case 1:
        scene0.dispose();
        scene1.render();
        break;
    }
  });
};

window.addEventListener("resize", () => {
  engine.resize();
});
