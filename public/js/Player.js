export default class Player {
  constructor(scene) {
    this.scene = scene;

    this.model = this.scene.assetsManager.Models["baseball"];
    this.model.meshes.forEach((mesh) => {
      mesh.setEnabled(true);
      mesh.isPickable = false;
      mesh.applyFog = false;
    });
    this.mesh = this.model.meshes[0];
    this.mesh.name = "baseball";
    this.mesh.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);

    this.initTrail();
    this.initPhisics();
    this.initGui();

    this.scene.scene.registerBeforeRender(() => {
      this.updateRays();
      this.checkGroundDistance();
      this.updateIndicator();
      this.move();
    });
  }

  initTrail() {
    this.trail = new BABYLON.TrailMesh("trail", this.mesh, this.scene.scene, 0.35, 30, true);
    this.trail.material = new BABYLON.StandardMaterial("cell", this.scene.scene);
    this.trail.material.computeHighLevel = true;
    this.trail.isPickable = false;
  }

  initPhisics() {
    var { minimum, maximum } = this.model.meshes[1].getBoundingInfo().boundingBox;
    this.mesh.setBoundingInfo(new BABYLON.BoundingInfo(minimum, maximum));

    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 1 },
      this.scene.scene
    );
    this.mesh.reIntegrateRotationIntoRotationQuaternion = true;
  }

  initGui() {
    this.indicator = BABYLON.MeshBuilder.CreatePlane("indicator", {
      height: 1,
      width: 1,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });
    this.indicator.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    this.indicator.renderingGroupId = 2;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.indicator);
    advancedTexture.parseContent(this.scene.assetsManager.Guis["Speed"]);

    let arrow = BABYLON.MeshBuilder.CreatePlane("indicator", {
      height: 1,
      width: 1,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });
    arrow.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    arrow.renderingGroupId = 2;
    arrow.parent = this.indicator;
    arrow.position = new BABYLON.Vector3(0, -0.7, 0);

    var advancedTexture2 = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(arrow);
    advancedTexture2.parseContent(this.scene.assetsManager.Guis["Speed"]);
    advancedTexture2.getChildren()[0]._children[0].text = "➡";

    this.updateIndicator = () => {
      this.indicator.position = this.mesh.position.add(new BABYLON.Vector3(0, 0.7, 0));
      advancedTexture.getChildren()[0]._children[0].text = `${(((this.speed * 100) / 15) * -1).toFixed(0)}%`;

      let axis1 = this.getLinearVelocity();
      let axis3 = BABYLON.Vector3.Cross(new BABYLON.Vector3.Zero(), axis1);
      let axis2 = BABYLON.Vector3.Cross(axis3, axis1);
      arrow.rotation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
    };
  }

  spawn() {
    this.respawn();
    this.maxSpeed = 15;
    this.jumpHeight = 8;
    this.speed = 0;
    this.jump = 2;
    this.normalCamera = true;
    this.deaths = 0;
    let time = Date.now();
    this.LastKeyDown = { up: time, space: time, r: time };
  }

  updateRays() {
    var { minimum, maximum } = this.mesh.getBoundingInfo().boundingBox;
    var { x, y, z } = this.mesh.getAbsolutePosition();

    const offset = 1;
    const scale = 0.8 * offset;
    const topLeft = x + minimum.x * scale;
    const bottomLeft = x + maximum.x * scale;
    const topRight = z + minimum.z * scale;
    const bottomRight = z + maximum.z * scale;
    const height = y + minimum.y * scale;

    var vectors = [
      new BABYLON.Vector3(topLeft, height, 0),
      new BABYLON.Vector3(topLeft, height, topRight),
      new BABYLON.Vector3(topLeft, height, bottomRight),
      new BABYLON.Vector3(bottomLeft, height, 0),
      new BABYLON.Vector3(bottomLeft, height, topRight),
      new BABYLON.Vector3(bottomLeft, height, bottomRight),
      new BABYLON.Vector3(x, height, topRight),
      new BABYLON.Vector3(x, height, bottomRight),
      new BABYLON.Vector3(x, height, z),
    ];

    if (this.rays) {
      vectors.forEach((vector, index) => {
        this.rays[index].origin = vector;
      });
    } else {
      this.rays = [];
      vectors.forEach((vector) => {
        let length = 0.5 - BABYLON.Vector3.Distance(vector, vectors[vectors.length - 1]) * 0.6;
        var ray = new BABYLON.Ray(vector, new BABYLON.Vector3(0, -1, 0), length);
        ray.isPickable = false;
        this.rays.push(ray);
      });
    }
  }

  move() {
    if (this.scene.inputStates.space && Date.now() - this.LastKeyDown.space > 300) {
      this.scene.distanceCamera(this.normalCamera);
      this.normalCamera = !this.normalCamera;
      this.LastKeyDown.space = Date.now();
    }
    if (this.normalCamera) {
      if (this.scene.inputStates.up && this.canJump()) {
        this.setLinearVelocity();
        this.scene.assetsManager.Audio["jump"].play();
        this.jump--;
        this.LastKeyDown.up = Date.now();
      }
      if (this.scene.inputStates.down) {
        this.speed = 0;
        this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        this.resetRotation();
      }
      if (this.scene.inputStates.left) {
        this.updateSpeed(true);
        this.setAngularVelocity();
      }
      if (this.scene.inputStates.right) {
        this.updateSpeed(false);
        this.setAngularVelocity();
      }
      if (this.scene.inputStates.r && Date.now() - this.LastKeyDown.r > 300) {
        this.respawn();
        this.LastKeyDown.r = Date.now();
      }
    } else {
      if (this.scene.inputStates.up) {
        if (this.scene.camera.radius > 5) {
          this.scene.camera.radius -= 1;
        }
      }
      if (this.scene.inputStates.down) {
        if (this.scene.camera.radius < 400) {
          this.scene.camera.radius += 1;
        }
      }
      if (this.scene.inputStates.left) {
        this.scene.camera.alpha -= 0.01;
      }
      if (this.scene.inputStates.right) {
        this.scene.camera.alpha += 0.01;
      }
    }

    this.updateColor();
  }

  checkGroundDistance() {
    for (let ray of this.rays) {
      let pick = this.scene.scene.pickWithRay(ray);
      if (pick.distance != 0) {
        this.jump = 2;
        break;
      }
    }
  }

  canJump() {
    return this.jump > 0 && Date.now() - this.LastKeyDown.up > 300;
  }

  resetRotation() {
    this.mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Zero(), 0);
  }

  getLinearVelocity() {
    var vector;
    switch (this.orientation) {
      case "front":
        vector = new BABYLON.Vector3(-this.speed, this.jumpHeight, 0);
        break;
      case "right":
        vector = new BABYLON.Vector3(0, this.jumpHeight, this.speed);
        break;
      case "back":
        vector = new BABYLON.Vector3(this.speed, this.jumpHeight, 0);
        break;
      case "left":
        vector = new BABYLON.Vector3(0, this.jumpHeight, -this.speed);
        break;
    }
    return vector;
  }

  setLinearVelocity() {
    this.mesh.physicsImpostor.setLinearVelocity(this.getLinearVelocity());
  }

  setAngularVelocity() {
    var vector;
    switch (this.orientation) {
      case "front":
        vector = new BABYLON.Quaternion(0, 0, this.speed, 0);
        break;
      case "right":
        vector = new BABYLON.Quaternion(this.speed, 0, 0, 0);
        break;
      case "back":
        vector = new BABYLON.Quaternion(0, 0, -this.speed, 0);
        break;
      case "left":
        vector = new BABYLON.Quaternion(-this.speed, 0, 0, 0);
        break;
    }
    this.mesh.physicsImpostor.setAngularVelocity(vector);
  }

  updateSpeed(increase) {
    let delta = increase ? 0.1 : -0.1;

    if (this.speed >= -this.maxSpeed && this.speed <= this.maxSpeed) {
      if (this.speed > -1 && this.speed < 1) {
        this.speed += delta * 1;
        return;
      }
      if (this.speed > -5 && this.speed < 5) {
        this.speed += delta * 3;
      } else {
        this.speed += delta * 5;
      }
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }
  }

  updateColor() {
    let color;
    switch (this.jump) {
      case 0:
        color = new BABYLON.Color3(1, 0, 0);
        break;
      case 1:
        color = new BABYLON.Color3(1, 1, 0);
        break;
      default:
        color = new BABYLON.Color3(1, 1, 1);
    }
    this.trail.material.emissiveColor = color;
  }

  respawn() {
    if (this.lastCheckPointData) {
      this.mesh.position = this.lastCheckPointData.position;
      this.orientation = this.lastCheckPointData.orientation;
      this.scene.camera.alpha = this.lastCheckPointData.cameraAlpha;
    } else {
      this.mesh.position = this.scene.spawnPoint;
    }
    this.speed = 0;
    this.maxSpeed = 15;
    this.jumpHeight = 8;
    this.scene.player.accelerated = false;
    this.scene.player.slowed = false;
    this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.resetRotation();
    this.scene.changeFogColor();
    this.deaths++;
  }
}
