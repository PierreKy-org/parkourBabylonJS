import Scene from "./Scene.js";

let canvas;
let engine;
let scene;

window.onload = () => {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = new Scene(engine);

  engine.runRenderLoop(() => {
    scene.render();
  });
};

window.addEventListener("resize", () => {
  engine.resize();
});
