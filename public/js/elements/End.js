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

    this.box.material = await BABYLON.NodeMaterial.ParseFromFileAsync(
      "Simple #NJXV5A#12",
      "../../assets/materials/simple.json",
      this.scene.scene
    );

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
    this.particles = new BABYLON.ParticleSystem("particles", 2000, this.scene.scene);
    this.particles.particleTexture = new BABYLON.Texture("../../assets/flare.png", this.scene.scene);

    this.particles.emitter = this.box.position.add(new BABYLON.Vector3(0, 2, 0));

    // Colors of all particles
    this.particles.color1 = new BABYLON.Color4(1, 1, 0, 1.0);
    this.particles.color2 = new BABYLON.Color4(1, 0.2, 0, 1.0);
    this.particles.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    // Size of each particle (random between...
    this.particles.minSize = 0.1;
    this.particles.maxSize = 0.5;

    // Life time of each particle (random between...
    this.particles.minLifeTime = 0.3;
    this.particles.maxLifeTime = 1.5;

    // Emission rate
    this.particles.emitRate = 500;

    /******* Emission Space ********/
    this.particles.createCylinderEmitter(0.05, 3, 0.05, 0);

    // Speed
    this.particles.minEmitPower = 0.1;
    this.particles.maxEmitPower = 2;
    this.particles.updateSpeed = 0.008;

    this.particles.gravity = new BABYLON.Vector3(0, -2.0, 0);
    this.particles.renderingGroupId = 1;

    // Start the particle system
    this.particles.start();
  }

  onPlayerCollision() {
    window.changeScene(0);
  }
}
