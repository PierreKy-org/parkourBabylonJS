import Scene from "./Scene.js";
import MainMenu from "./MainMenu.js";

let iframe = document.createElement("iframe");
iframe.src = "https://editor.isf.video/shaders/5e7a7f837c113618206ddf11/embed?embed_controls_state=1";
iframe.setAttribute("frameborder", "0");
document.body.appendChild(iframe);

const refreshScores = async () => {
  let file = await fetch("/getScore");
  window.scores = await file.json();
};

window.onload = async () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var menu = new MainMenu();
  var currentScene = menu;
  await refreshScores();

  window.changeScene = async (index) => {
    await refreshScores();

    if (currentScene == menu) {
      currentScene.pause();
    } else {
      currentScene.scene.dispose();
    }
    switch (index) {
      case -1:
        currentScene = menu;
        currentScene.resume();
        break;
      default:
        currentScene = new Scene(`level_${index}.json`);
    }
  };

  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    iframe.style.visibility = "visible";
    window.canvas.style.display = "none";
  };

  BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    if (currentScene.loaded) {
      window.canvas.style.display = "block";
      iframe.style.visibility = "hidden";
    }
  };

  window.addEventListener("keydown", (event) => currentScene.changeInputState(event.key, true), false);

  window.addEventListener("keyup", (event) => currentScene.changeInputState(event.key, false), false);

  window.addEventListener("resize", () => {
    window.engine.resize();
  });

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};
