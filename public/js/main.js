import Scene from "./Scene.js";

window.onload = () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var currentScene;
  var Scenes = [
    new Scene({
      baseball: { path: "../../assets/baseball/", gltf: "scene.gltf" },
    }),
  ];

  var createScene0 = function () {
    var scene0 = new BABYLON.Scene(window.engine);

    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene0);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(window.canvas, true);

    let goToGame = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene0);
    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Go To Game");
    button1.width = "150px";
    button1.height = "40px";
    button1.color = "white";
    button1.alpha = 0.6;

    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function () {
      currentScene.dispose();
      currentScene = Scenes[0];
      currentScene.initScene();
    });
    goToGame.addControl(button1);

    return scene0;
  };

  currentScene = createScene0();

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};

window.addEventListener("resize", () => {
  window.engine.resize();
});
