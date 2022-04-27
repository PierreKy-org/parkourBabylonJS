export default class Player {
  constructor(scene) {
    this.scene = scene;

    this.model = this.scene.assetsManager.Assets["baseball"];
    this.mesh = this.model.meshes[0];
    this.mesh.name = "baseball";
    this.mesh.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);

    this.initPhisics();
    this.initTrail();
  }

  initTrail() {
    this.trail = new BABYLON.TrailMesh("trail", this.mesh, this.scene.scene, 0.35, 30, true);
    this.trail.material = new BABYLON.StandardMaterial("cell", this.scene.scene);
    this.trail.material.computeHighLevel = true;
  }

  initPhisics() {
    var { minimum, maximum } = this.model.meshes[1].getBoundingInfo().boundingBox;
    this.mesh.setBoundingInfo(new BABYLON.BoundingInfo(minimum, maximum));
    this.mesh.showBoundingBox = true;

    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 1 },
      this.scene.scene
    );
    this.mesh.reIntegrateRotationIntoRotationQuaternion = true;

    this.scene.scene.registerBeforeRender(() => {
      this.updateRays();
      this.checkGroundDistance();
    });
  }

  spawn() {
    this.respawn();
    this.speed = 0;
    this.jump = 2;
    this.normalCamera = true;
    this.orientation = "front";
    this.lastJump = Date.now();
    this.spaceLastKeyDown = Date.now();
  }

  updateRays() {
    var { minimum, maximum } = this.mesh.getBoundingInfo().boundingBox;
    var { x, y, z } = this.mesh.getAbsolutePosition();

    const offset = 0.5;
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
        var ray = new BABYLON.Ray(vector, new BABYLON.Vector3(0, -1, 0), 0.3);
        BABYLON.RayHelper.CreateAndShow(ray, this.scene.scene, new BABYLON.Color3(0, 0, 1));
        this.rays.push(ray);
      });
    }
  }

  move() {
    if (this.scene.inputStates.space && Date.now() - this.spaceLastKeyDown > 300) {
      this.scene.distanceCamera(this.normalCamera);
      this.normalCamera = !this.normalCamera;
      this.spaceLastKeyDown = Date.now();
    }
    if (this.normalCamera) {
      if (this.scene.inputStates.up && this.canJump()) {
        this.setLinearVelocity();
        this.jump--;
        this.lastJump = Date.now();
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
      if (this.scene.inputStates.r && this.lastCheckPointData) {
        this.mesh.position = this.lastCheckPointData.position;
        this.orientation = this.lastCheckPointData.orientation;
        this.speed = 0;
        this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        this.resetRotation();
        this.scene.camera.alpha = this.lastCheckPointData.cameraAlpha;
      }
    }

    this.updateColor();
  }

  checkGroundDistance() {
    for (let ray of this.rays) {
      let distance = this.scene.scene.pickWithRay(ray, (mesh) => {
        return (
          ![this.model.meshes[1].name, "ray"].includes(mesh.name) &&
          ![this.scene.ground.mesh, this.trail].includes(mesh)
        );
      }).distance;
      if (distance != 0) {
        this.jump = 2;
        break;
      }
    }
  }

  canJump() {
    return this.jump > 0 && Date.now() - this.lastJump > 300;
  }

  resetRotation() {
    this.mesh.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(BABYLON.Vector3.Zero(), 0);
  }

  setLinearVelocity() {
    var vector;
    switch (this.orientation) {
      case "front":
        vector = new BABYLON.Vector3(-this.speed, 8, 0);
        break;
      case "right":
        vector = new BABYLON.Vector3(0, 8, this.speed);
        break;
      case "back":
        vector = new BABYLON.Vector3(this.speed, 8, 0);
        break;
      case "left":
        vector = new BABYLON.Vector3(0, 8, -this.speed);
        break;
    }
    this.mesh.physicsImpostor.setLinearVelocity(vector);
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
    const maxSpeed = 15;

    if (this.speed >= -maxSpeed && this.speed <= maxSpeed) {
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
    if (this.speed > maxSpeed) {
      this.speed = maxSpeed;
    } else if (this.speed < -maxSpeed) {
      this.speed = -maxSpeed;
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
      this.mesh.position = BABYLON.Vector3.Zero();
    }
    this.speed = 0;
    this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.resetRotation();
  }
}
