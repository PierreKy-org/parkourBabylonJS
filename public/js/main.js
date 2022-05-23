import Scene from "./Scene.js";
import MainMenu from "./MainMenu.js";

window.onload = async () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var menu = new MainMenu();
  var currentScene = menu;

  window.changeScene = (index) => {
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

  let iframe = document.createElement("iframe");
  iframe.src = "https://editor.isf.video/shaders/5e7a7fe17c113618206de63b/embed?embed_controls_state=1";
  iframe.setAttribute("frameborder", "0");
  document.body.appendChild(iframe);

  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    iframe.style.visibility = "visible";
    this._loadingDiv = iframe;
    this._resizeLoadingUI();
  };

  BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    if (currentScene.loaded) {
      iframe.style.visibility = "hidden";
    }
  };

  window.test = () => console.log(iframe.style.width, iframe.style.height);

  window.addEventListener("keydown", (event) => currentScene?.changeInputState(event.key, true), false);

  window.addEventListener("keyup", (event) => currentScene?.changeInputState(event.key, false), false);

  window.addEventListener("resize", () => {
    window.engine.resize();
  });

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};
