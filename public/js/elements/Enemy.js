export { XEnemy, YEnemy, ZEnemy };

class Enemy {
  static builder;

  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
  }

  async initInstance(pX, pY, pZ) {
    if (Enemy.model && Enemy.model.meshes[0]._scene != this.scene.scene) {
      Enemy.model.meshes[0].dispose();
      Enemy.model = undefined;
    }

    if (!Enemy.model) {
      Enemy.model = this.scene.assetsManager.Models["enemy"];
      Enemy.model.meshes[0].name = "enemy model";
    }
    this.mesh = Enemy.model.meshes[1].createInstance(`enemy_${pX}_${pY}_${pZ}`);
    this.mesh.scaling = new BABYLON.Vector3(0.015, 0.015, 0.015);
    this.mesh.enableEdgesRendering();
    this.mesh.edgesWidth = 4.0;
    this.mesh.edgesColor = new BABYLON.Color4(1, 0, 0, 1);
    this.mesh.isPickable = false;

    this.mesh.alwaysSelectAsActiveMesh = true;
    this.mesh.position = new BABYLON.Vector3(pX, pY, pZ);

    this.setPhysics();
  }

  setPhysics() {
    this.mesh.checkCollisions = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(0.4, 0.5, 0.4);
    this.mesh.rotationQuaternion = null;

    this.mesh.actionManager = new BABYLON.ActionManager(this.scene.scene);
    this.mesh.actionManager.registerAction(
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

    this.lastPos = this.mesh.position.clone();
    this.direction = this.getInitialDirection();
    this.scene.scene.registerBeforeRender(() => {
      if (this.scene.loaded) {
        this.mesh.moveWithCollisions(this.direction);
        if (this.lastPos.equals(this.mesh.position)) {
          this.direction = this.direction.negate();
        }
        this.lastPos = this.mesh.position.clone();
      }
    });
  }
}

class XEnemy extends Enemy {
  getInitialDirection() {
    return new BABYLON.Vector3(0.05, 0, 0);
  }
}

class YEnemy extends Enemy {
  getInitialDirection() {
    return new BABYLON.Vector3(0, 0.05, 0);
  }
}

class ZEnemy extends Enemy {
  getInitialDirection() {
    return new BABYLON.Vector3(0, 0, 0.05);
  }
}
