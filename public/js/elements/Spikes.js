export { SpikesBottom, SpikesTop, SpikesFront, SpikesBack, SpikesLeft, SpikesRight };

class Spikes {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  async initInstance(pX, pY, pZ) {
    if (Spikes.builder && Spikes.builder._scene != this.scene.scene) {
      Spikes.builder.dispose();
      Spikes.builder = undefined;
    }

    var spike;
    if (!Spikes.builder) {
      let spikes = [];
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          let x = i * 0.3;
          let y = 0.25;
          let z = j * 0.3;

          let spike = BABYLON.MeshBuilder.CreateCylinder(
            `spike_${x}_${y}_${z}`,
            { diameterTop: 0, height: 0.5, tessellation: 96, diameter: 0.3 },
            this.scene.scene
          );
          spike.position = new BABYLON.Vector3(x, y, z);

          spikes.push(spike);
        }
      }

      Spikes.builder = BABYLON.Mesh.MergeMeshes(spikes);

      Spikes.builder.renderOutline = true;
      Spikes.builder.outlineWidth = 0.01;
      Spikes.builder.outlineColor = new BABYLON.Color3(1, 0, 0);

      Spikes.builder.material = this.scene.assetsManager.Materials["Spike #NJXV5A#14"];

      Spikes.builder.name = `spikes_${pX}_${pY}_${pZ}`;
      Spikes.builder.isPickable = false;

      spike = Spikes.builder;
    } else {
      spike = Spikes.builder.createInstance(`spikes_${pX}_${pY}_${pZ}`);
    }
    spike.alwaysSelectAsActiveMesh = true;
    spike.position = new BABYLON.Vector3(pX, pY - 0.5, pZ);

    this.rotate(spike);

    this.setPhysics(spike);

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
        () => {
          this.scene.assetsManager.Audio["hit"].play();
          this.scene.player.respawn();
        }
      )
    );
  }
}

class SpikesTop extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3.Zero();
  }
}

class SpikesBottom extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3(0, 0, Math.PI);
    spike.position = spike.position.add(new BABYLON.Vector3(0, 1, 0));
  }
}

class SpikesFront extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
    spike.position = spike.position.add(new BABYLON.Vector3(-2, 1.5, -0.5));
  }
}

class SpikesBack extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    spike.position = spike.position.add(new BABYLON.Vector3(-3, 1.5, 0.5));
  }
}

class SpikesLeft extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3(Math.PI / 2, -Math.PI / 2, 0);
    spike.position = spike.position.add(new BABYLON.Vector3(0.5, 0.5, 0));
  }
}

class SpikesRight extends Spikes {
  rotate(spike) {
    spike.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);
    spike.position = spike.position.add(new BABYLON.Vector3(-0.5, 0.5, 0));
  }
}
