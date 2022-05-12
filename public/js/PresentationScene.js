export default class PresentationScene {
    constructor() {
      this.scene = new BABYLON.Scene(window.engine);
      this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
      this.camera.setTarget(BABYLON.Vector3.Zero());
      this.camera.attachControl(window.canvas, true);
  
      this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);
      this.initScene();
    }
  
    async initScene() {
      await this.advancedTexture.parseFromURLAsync("../assets/materials/guiPresentation.json");
      
  
      var animationHideText = new BABYLON.Animation("myAnimation", "width", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
      var keys = []; 
  
      keys.push({
          frame: 0,
          value: 0.12
      });
  
      keys.push({
          frame: 30,
          value: 0.1
      });
      keys.push({
        frame: 60,
        value: 0.12
    });


    var animationshowText = new BABYLON.Animation("myAnimation", "height", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyss = []; 

    keyss.push({
        frame: 0,
        value: 0.04
    });

    keyss.push({
        frame: 30,
        value: 0.03
    });
    keyss.push({
      frame: 60,
      value: 0.04
  });
      animationshowText.setKeys(keyss);
      animationHideText.setKeys(keys);
      this.advancedTexture.getControlByName("bouton").animations = [];
      this.scene.beginDirectAnimation(this.advancedTexture.getControlByName("bouton"), [animationHideText, animationshowText], 0, 100, true);
      //Mode facile
      this.advancedTexture.getControlByName("bouton").onPointerUpObservable.add(() => {
        window.changeScene(1);
        })
  
    }
  
    render() {
      this.scene.render();
    }
  }
  