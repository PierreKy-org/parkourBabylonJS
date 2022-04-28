import Scene from "./Scene.js";
import MenuScene from "./MenuScene.js";

window.onload = () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var currentScene;
  var Scenes = [
    () => new MenuScene(),
    () =>
      new Scene(
        {
          baseball: { path: "../../assets/models/baseball/", gltf: "scene.gltf" },
          pumpkin: { path: "../../assets/models/pumpkin/", gltf: "pumpkin.gltf" },
        },
        "levelTest.json"
      ),
  ];

  window.changeScene = (index) => {
    if (currentScene) {
      currentScene.scene.dispose();
    }
    currentScene = Scenes[index]();
  };

  window.changeScene(0);

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};

window.addEventListener("resize", () => {
  window.engine.resize();
});
