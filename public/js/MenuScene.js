export default class MenuScene {
  constructor() {
    this.scene = new BABYLON.Scene(window.engine);
    this.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(window.canvas, true);

    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UIMenu", true, this.scene);
    this.initScene();
  }

  async initScene() {
    await this.advancedTexture.parseFromURLAsync("../assets/materials/guilevel.json");
    for(let i = 1; i < 10; i++) {
      this.advancedTexture.getControlByName("level" + i).textBlock.text = i
      this.advancedTexture.getControlByName("level" + i).onPointerUpObservable.add(() => {
        window.changeScene(i+1);
      });
      this.advancedTexture.getControlByName("level" + i).onPointerEnterObservable.add(() => {
        this.advancedTexture.getControlByName("level" + i).textBlock.text = i+ "\ntimer\ncollected"
      })
      this.advancedTexture.getControlByName("level" + i).onPointerOutObservable.add(() => {
        this.advancedTexture.getControlByName("level" + i).alpha = 1;
        this.advancedTexture.getControlByName("level" + i).textBlock.text = i

      })
    }

    //Mode facile
    this.advancedTexture.getControlByName("facile").onIsCheckedChangedObservable.add(() => {
    this.scene.checked = this.advancedTexture.getControlByName("facile").isChecked
    console.log(this.scene.checked)
      })

    //Bouton help
    this.advancedTexture.getControlByName("help").onPointerUpObservable.add(() => {
      window.changeScene(10);
    });
    
   /*/ fetch("http://localhost:8000/levels")
      .then((res) => res.json())
      .then((json) => {
        json.forEach((level) => {
          var button = BABYLON.GUI.Button.CreateSimpleButton(level, level);
          button.width = 0.2;
          button.height = "70px";
          button.color = "white";
          button.background = "green";
          //button position
          var pos =
            (parseInt(button.textBlock.text.split("_")[1]) * window.innerHeight) / json.length -
            window.innerHeight / json.length;
          button.top = pos.toString() + "px";
          button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
          button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          //attach button1 to advancedTexture
          this.advancedTexture.addControl(button);
          var buttons = this.advancedTexture.getChildren()[0].children;
          buttons.forEach((button) => {
            button.lastClick = Date.now();
            button.onPointerUpObservable.add(() => {
              if (Date.now() - button.lastClick > 200) {
                button.lastClick = Date.now();
                window.changeScene(parseInt(button.textBlock.text.split("_")[1]));
              }
            });
          });
        });
      });*/


  }

  render() {
    this.scene.render();
  }
}
