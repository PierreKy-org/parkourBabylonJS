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
          models: {
            baseball: {
              path: "../../assets/models/baseball/",
              gltf: "scene.gltf",
            },
            pumpkin: {
              path: "../../assets/models/pumpkin/",
              gltf: "pumpkin.gltf",
            },
            trampoline: {
              path: "../../assets/models/trampoline/",
              gltf: "trampoline.obj",
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
          textures: [
            "../../assets/textures/end.json",
            "../../assets/textures/esc.json",
          ],
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
          },
        },
        "level_1.json"
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
