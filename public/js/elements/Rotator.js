export { RotatorFR, RotatorFL, RotatorBR, RotatorBL, RotatorLF, RotatorLB, RotatorRF, RotatorRB };
class Rotator {
  constructor(pX, pY, pZ, scene) {
    this.scene = scene;
    this.initInstance(pX, pY, pZ);
    this.setPhysics();
  }

  initInstance(pX, pY, pZ) {
    if (Rotator.builder && Rotator.builder._scene != this.scene.scene) {
      Rotator.builder.dispose();
      Rotator.builder = undefined;
    }

    if (!Rotator.builder) {
      Rotator.builder = BABYLON.MeshBuilder.CreateTorus("torus", {
        tessellation: 6,
        thickness: 0.5,
        diameter: 2,
      });
      Rotator.builder.rotation.z = Math.PI / 2;

      Rotator.builder.name = `${this.constructor.name}_${pX}_${pY}_${pZ}`;

      Rotator.builder.material = this.scene.assetsManager.Materials["Simple #NJXV5A#12"];

      this.box = Rotator.builder;
    } else {
      this.box = Rotator.builder.createInstance(`${this.constructor.name}_${pX}_${pY}_${pZ}`);
    }
    this.plane = BABYLON.Mesh.CreatePlane("rotator_arrow", 1.5);
    this.plane.parent = this.box;
    this.plane.position.x = 1.5;
    this.plane.renderingGroupId = 2;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);

    advancedTexture.parseContent(this.scene.assetsManager.Guis["Arrow"]);

    this.setRotation();

    this.box.alwaysSelectAsActiveMesh = true;
    this.box.position = new BABYLON.Vector3(pX, pY + 0.1, pZ);
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
        () => {
          this.scene.camera.inRotator = true;
        }
      )
    );
    this.box.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
          parameter: {
            mesh: this.scene.player.mesh,
          },
        },
        () => this.onPlayerCollision()
      )
    );
  }

  rotate(orientation, from, to, angular, linear) {
    this.scene.assetsManager.Audio["glitch"].play();
    this.scene.player.orientation = orientation;

    this.scene.camera.currentAnimation = BABYLON.Animation.CreateAndStartAnimation(
      this.constructor.name,
      this.scene.camera,
      "alpha",
      1.5,
      1,
      BABYLON.Tools.ToRadians(from),
      BABYLON.Tools.ToRadians(to),
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
      null,
      () => {
        if (!this.scene.camera.inRotator) {
          this.scene.camera.alpha = BABYLON.Tools.ToRadians(to);
          this.scene.player.lastCheckPointData.checkpoint?.setCheckpointData();
        }
        this.scene.camera.inRotator = false;
      }
    );

    this.scene.changeFogColor();

    this.scene.player.resetRotation();
    let av = this.scene.player.mesh.physicsImpostor.getAngularVelocity();
    this.scene.player.mesh.physicsImpostor.setAngularVelocity(
      new BABYLON.Vector3(av.z * angular.x, av.y * angular.y, av.x * angular.z)
    );
    let al = this.scene.player.mesh.physicsImpostor.getLinearVelocity();
    this.scene.player.mesh.physicsImpostor.setLinearVelocity(
      new BABYLON.Vector3(al.z * linear.x, al.y * linear.y, al.x * linear.z)
    );
  }
}

class RotatorFR extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.x = this.box.position.x + 1;
    this.rotate("right", 270, 180, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, -1));
  }

  setRotation() {
    this.plane.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 3 * (Math.PI / 2));
  }
}

class RotatorFL extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.x = this.box.position.x + 1;
    this.rotate("left", 270, 360, new BABYLON.Vector3(-1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }

  setRotation() {
    this.plane.rotation = new BABYLON.Vector3(Math.PI / 2, 0, Math.PI / 2);
  }
}

class RotatorBR extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.x = this.box.position.x - 1;
    this.rotate("right", 90, 180, new BABYLON.Vector3(-1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }

  setRotation() {
    this.plane.rotation = new BABYLON.Vector3(3 * (Math.PI / 2), 0, Math.PI / 2);
  }
}

class RotatorBL extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.x = this.box.position.x - 1;
    this.rotate("left", 90, 180, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(1, 1, 1));
  }

  setRotation() {
    this.plane.rotation = new BABYLON.Vector3(3 * (Math.PI / 2), 0, Math.PI / 2);
  }
}

class RotatorRF extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.z = this.box.position.z - 1;
    this.rotate("front", 180, 270, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, 1));
  }

  setRotation() {
    this.box.rotation.y = Math.PI / 2;
    this.plane.rotation = new BABYLON.Vector3(3 * (Math.PI / 2), 0, 3 * (Math.PI / 2));
  }
}

class RotatorRB extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.z = this.box.position.z + 1;
    this.rotate("back", 180, 90, new BABYLON.Vector3(1, 0, -1), new BABYLON.Vector3(1, 1, 1));
  }

  setRotation() {
    this.box.rotation.y = Math.PI / 2;
  }
}

class RotatorLF extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.z = this.box.position.z - 1;
    this.rotate("front", 360, 270, new BABYLON.Vector3(1, 0, -1), new BABYLON.Vector3(1, 1, 1));
  }

  setRotation() {
    this.box.rotation.y = Math.PI / 2;
  }
}

class RotatorLB extends Rotator {
  onPlayerCollision() {
    this.scene.player.mesh.position.z = this.box.position.z + 1;
    this.rotate("back", 0, 90, new BABYLON.Vector3(1, 0, 1), new BABYLON.Vector3(-1, 1, 1));
  }

  setRotation() {
    this.box.rotation.y = Math.PI / 2;
    this.plane.rotation = new BABYLON.Vector3(3 * (Math.PI / 2), 0, Math.PI / 2);
  }
}
