export { Spikes };

class Spikes {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let x = pX + i * 0.3;
        let y = pY - 0.25;
        let z = pZ + j * 0.3;
        let spike = this.initInstance(x, y, z);
        //TODO MODIFIER CAR LA LES 9 HITS
        this.setPhysics(spike);
      }
    }
  }

  initInstance(pX, pY, pZ) {
    var spike;
    if (!Spikes.builder || Spikes.builder._scene != this.scene) {
      Spikes.builder = BABYLON.MeshBuilder.CreateCylinder(
        "cone",
        { diameterTop: 0, height: 0.5, tessellation: 96, diameter: 0.3 },
        this.scene.scene
      );
      Spikes.builder.name = `spike_${pX}_${pY}_${pZ}`;

      BABYLON.NodeMaterial.ParseFromSnippetAsync("#NJXV5A#14", this.scene.scene).then((nodeMaterial) => {
        Spikes.builder.material = nodeMaterial;
      });

      spike = Spikes.builder;
    } else {
      spike = Spikes.builder.createInstance(`spike_${pX}_${pY}_${pZ}`);
    }
    spike.alwaysSelectAsActiveMesh = true;
    spike.position = new BABYLON.Vector3(pX, pY, pZ);

    return spike;
  }

  setPhysics(spike) {
    spike.checkCollisions = true;
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
