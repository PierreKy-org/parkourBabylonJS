import Scene from "./Scene.js";
import PresentationScene from "./PresentationScene.js";
import HelpScene from "./HelpScene.js";

window.onload = async () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var currentScene;

  window.changeScene = (index) => {
    if (currentScene) {
      currentScene.scene.dispose();
    }
    switch (index) {
      case -1:
        currentScene = new PresentationScene();
        break;
      case -2:
        currentScene = new HelpScene();
        break;
      default:
        currentScene = new Scene(`level_${index - 1}.json`);
    }
  };

  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
      document.getElementById("customLoadingScreenDiv").style.display = "initial";
      return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = `<img src="assets/images/loading.gif" alt="LOADING..."  width="100%" />`;

    var customLoadingScreenCss = document.createElement("style");
    customLoadingScreenCss.innerHTML = `
    #customLoadingScreenDiv{
        background-color: black;
        overflow: hidden;
    }
    `;

    this._resizeLoadingUI();
    document.body.appendChild(this._loadingDiv);
    document.body.appendChild(customLoadingScreenCss);
  };

  BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    if (currentScene.loaded) {
      document.getElementById("customLoadingScreenDiv").style.display = "none";
    }
  };

  window.addEventListener("keydown", (event) => currentScene?.changeInputState(event.key, true), false);

  window.addEventListener("keyup", (event) => currentScene?.changeInputState(event.key, false), false);

  window.addEventListener("resize", () => {
    window.engine.resize();
  });

  window.changeScene(-1);

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};
