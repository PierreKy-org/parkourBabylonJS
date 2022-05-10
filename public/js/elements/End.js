export default class End {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  async initInstance(pX, pY, pZ) {
    this.top = BABYLON.MeshBuilder.CreateCylinder(
      "cylinder",
      {
        tessellation: 5,
        diameterTop: 1,
        diameterBottom: 0,
        height: 1,
      },
      this.scene.scene
    );
    this.top.position = new BABYLON.Vector3(0, 4, 0);

    this.bottom = BABYLON.MeshBuilder.CreateCylinder(
      "cylinder",
      {
        tessellation: 5,
        diameterTop: 0,
        diameterBottom: 1,
        height: 1,
      },
      this.scene.scene
    );
    this.bottom.position = BABYLON.Vector3.Zero();

    this.box = BABYLON.Mesh.MergeMeshes([this.top, this.bottom]);
    this.box.name = `end_${pX}_${pY}_${pZ}`;

    this.box.position = new BABYLON.Vector3(pX, pY, pZ);
    this.scene.endPosition = this.box.position.add(new BABYLON.Vector3(0, 2, 0));

    this.box.material = this.scene.assetsManager.Materials["Simple #NJXV5A#12"];

    this.setPhysics();
    this.setParticles();
  }

  setPhysics() {
    this.box.checkCollisions = true;

    this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );
  }

  setParticles() {
    BABYLON.ParticleHelper.ParseFromFileAsync("end", "../../assets/particles/end.json", this.scene.scene).then(
      (sys) => (sys.emitter = this.box.position.add(new BABYLON.Vector3(0, 2, 0)))
    );
  }

  onPlayerCollision() {
    let endTime = this.scene.getTimer();
    this.scene.pausex();
    this.scene.assetsManager.Audio["music"].stop();
    this.scene.assetsManager.Audio["end"].play();
    BABYLON.Animation.CreateAndStartAnimation(
      this.constructor.name,
      this.scene.camera,
      "radius",
      1.5,
      3,
      this.scene.camera.radius,
      2,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    this.scene.advancedTexture.parseContent(this.scene.assetsManager.Guis["End"]);
    this.scene.advancedTexture.idealWidth = 1500;
    this.scene.advancedTexture.idealHeight = 1200;
    this.scene.advancedTexture.getChildren()[0].isVisible = false;

    setTimeout(async () => {
      this.scene.advancedTexture.getChildren()[0].isVisible = true;

      let grid = this.scene.advancedTexture.getChildren()[0].children[0];
      let button = grid._children[3]._children[0];
      let time = grid._children[1]._children[0];
      let completion = grid._children[2]._children[0];

      time.text = endTime;
      completion.text = `${this.scene.collected}/${this.scene.collectable} Pumpkins Collected`;

      button.onPointerClickObservable.add(() => {
        fetch(`/addScore?level=${this.scene.map}&time=${endTime}&collected=${this.scene.collected}`);
        window.changeScene(0);
      });
    }, 2400);
  }
}
