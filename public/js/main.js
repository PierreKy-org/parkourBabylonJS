import Scene from "./Scene.js";
import MenuScene from "./MenuScene.js";

window.onload = () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var currentScene;
  var Scenes = [
    new Scene(
      {
        baseball: { path: "../../assets/baseball/", gltf: "scene.gltf" },
        pumpkin: { path: "../../assets/pumpkin/", gltf: "pumpkin.gltf" },
      },
      "level1.json"
    ),
    new MenuScene()
  ];

  //Envois le joueur dans le jeu
  Scenes[1].button1.onPointerUpObservable.add(function () {
    currentScene.scene.dispose();
    currentScene = Scenes[0];
    currentScene.initScene();
  });

  //quitte le jeu quand on appuie sur le bouton leave
  setTimeout(() => {
    Scenes[0].advancedTexture.leave.onPointerUpObservable.add(function () {
      currentScene.scene.dispose();
      
      currentScene = Scenes[1];
    }
    )
  }, 1200);
  

  currentScene = Scenes[1];

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};

window.addEventListener("resize", () => {
  window.engine.resize();
});
