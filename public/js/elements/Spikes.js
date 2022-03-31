import Simple from "./Simple.js";

export { Spikes };

class Spikes {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initBuilder();

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let x = pX + i * 0.3;
        let y = pY + 0.25;
        let z = pZ + j * 0.3;
        let spike = Spikes.builder.createInstance(`box_${x}_${y}_${z}`);
        spike.position = new BABYLON.Vector3(x, y, z);
        this.setPhysics(spike);
      }
    }

    this.box = BABYLON.MeshBuilder.CreateBox("box", {
      height: 0.5,
      width: 1,
      depth: 1,
    });
    this.box.position = new BABYLON.Vector3(pX, pY - 0.25, pZ);
  }

  initBuilder() {
    if (!Spikes.builder) {
      Spikes.builder = BABYLON.MeshBuilder.CreateCylinder(
        "cone",
        { diameterTop: 0, height: 0.5, tessellation: 96, diameter: 0.3 },
        this.scene.scene
      );

      Spikes.builder.alwaysSelectAsActiveMesh = true;

      Spikes.builder.material = new BABYLON.StandardMaterial("SpikeMaterial");
      Spikes.builder.material.disableLighting = true;
      Spikes.builder.material.emissiveColor = BABYLON.Color3.White();
      Spikes.builder.material.diffuseTexture = new BABYLON.Texture("../assets/brick.png", this.scene.scene);

      Spikes.builder.registerInstancedBuffer("color", 3);
      Spikes.builder.instancedBuffers.color = new BABYLON.Color3(1, 1, 1);
    }
  }

  setPhysics(spike) {
    spike.checkCollisions = true;
    spike.physicsImpostor = new BABYLON.PhysicsImpostor(
      spike,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0 },
      this.scene.scene
    );

    spike.actionManager = new BABYLON.ActionManager(this.scene.scene);
    spike.actionManager.registerAction(
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

  onPlayerCollision() {
    this.scene.player.mesh.position = this.scene.player.lastCheckPointData.position;
    this.scene.player.orientation = this.scene.player.lastCheckPointData.orientation;
    this.scene.player.speed = 0;
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.scene.player.resetRotation();
    this.scene.camera.alpha = this.scene.player.lastCheckPointData.cameraAlpha;
  }
}
