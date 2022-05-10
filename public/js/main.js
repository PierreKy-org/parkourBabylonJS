import Scene from "./Scene.js";
import MenuScene from "./MenuScene.js";
import PresentationScene from "./PresentationScene.js";

window.onload = () => {
  window.canvas = document.querySelector("#myCanvas");
  window.engine = new BABYLON.Engine(window.canvas, true);

  var assets = {
    models: {
      baseball: {
        path: "../../assets/models/baseball/",
        model: "scene.gltf",
      },
      pumpkin: {
        path: "../../assets/models/pumpkin/",
        model: "pumpkin.gltf",
      },
      trampoline: {
        path: "../../assets/models/trampoline/",
        model: "trampoline.obj",
      },
      flag: {
        path: "../../assets/models/flag/",
        model: "flag.obj",
      },
      enemy: {
        path: "../../assets/models/enemy/",
        model: "scene.gltf",
      },
    },
    materials: [
      {
        name: "Spike #NJXV5A#14",
        path: "../../assets/materials/spike.json",
      },
      {
        name: "Simple #NJXV5A#12",
        path: "../../assets/materials/simple.json",
      },
      {
        name: "Increase Speed #NJXV5A#17",
        path: "../../assets/materials/increaseSpeed.json",
      },
      {
        name: "Decrease Speed #NJXV5A#19",
        path: "../../assets/materials/decreaseSpeed.json",
      },
    ],
    guis: ["../../assets/gui/end.json", "../../assets/gui/arrow.json", "../../assets/gui/game.json"],
    audio: {
      jump: { path: "../../assets/audio/jump.wav", loop: false },
      hit: { path: "../../assets/audio/gameOver.mp3", loop: false },
      music: { path: "../../assets/audio/music.wav", loop: true },
      end: { path: "../../assets/audio/end.wav", loop: false },
      collected: {
        path: "../../assets/audio/collected.wav",
        loop: false,
      },
      decreaseSpeed: {
        path: "../../assets/audio/decreaseSpeed.wav",
        loop: false,
      },
      increaseSpeed: {
        path: "../../assets/audio/increaseSpeed.mp3",
        loop: false,
      },
      bounce: { path: "../../assets/audio/bounce.wav", loop: false },
      checkpoint: { path: "../../assets/audio/checkpoint.wav", loop: false },
      glitch: { path: "../../assets/audio/glitch.wav", loop: false },
    },
  };

  var currentScene;
  var Scenes = [() => new PresentationScene(), () => new MenuScene(), () => new Scene(assets, "level_2.json")];

  window.changeScene = (index) => {
    if (currentScene) {
      currentScene.scene.dispose();
    }
    currentScene = Scenes[index]();
  };

  BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
      document.getElementById("customLoadingScreenDiv").style.display = "initial";
      return;
    }
    this._loadingDiv = document.createElement("div");
    this._loadingDiv.id = "customLoadingScreenDiv";
    this._loadingDiv.innerHTML = `<img src="assets/images/loading.gif" alt="this slowpoke moves"  width="100%" />`;

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

  window.changeScene(0);

  window.engine.runRenderLoop(() => {
    currentScene.render();
  });
};

window.addEventListener("resize", () => {
  window.engine.resize();
});
