import Simple from "./Simple.js";

export { Spikes };

class Spikes {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let x = pX + i * 0.3;
        let y = pY + 0.25;
        let z = pZ + j * 0.3;
        let spike = this.initInstance(x, y, z);
        this.setPhysics(spike);
      }
    }

    this.box = BABYLON.MeshBuilder.CreateBox("box", {
      height: 0.5,
      width: 1,
      depth: 1,
    });
    this.box.position = new BABYLON.Vector3(pX, pY - 0.25, pZ);
    this.box.material = Spikes.builder.material;
  }

  initInstance(pX, pY, pZ) {
    var spike;
    if (!Spikes.builder) {
      Spikes.builder = BABYLON.MeshBuilder.CreateCylinder(
        "cone",
        { diameterTop: 0, height: 0.5, tessellation: 96, diameter: 0.3 },
        this.scene.scene
      );

      Spikes.builder.alwaysSelectAsActiveMesh = true;

      Spikes.builder.material = new BABYLON.CellMaterial("cell", this.scene.scene);
      Spikes.builder.material.computeHighLevel = true;
      Spikes.builder.material.diffuseColor = new BABYLON.Color3(0.9, 0.3, 0);

      spike = Spikes.builder;
    } else {
      spike = Spikes.builder.createInstance(`box_${pX}_${pY}_${pZ}`);
    }
    spike.position = new BABYLON.Vector3(pX, pY, pZ);

    return spike;
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
        () => this.scene.player.respawn()
      )
    );
  }
}
