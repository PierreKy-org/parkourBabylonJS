export default class Player {
  constructor(scene) {
    this.scene = scene;

    this.model = this.scene.assetsManager.Assets["baseball"];
    this.mesh = this.model.mesh;
    this.mesh.scaling = new BABYLON.Vector3(0.8, 0.8, 0.8);

    this.mesh.showBoundingBox = true;

    this.initPhisics();
    this.initTrail();
  }

  initTrail() {
    this.trail = new BABYLON.TrailMesh("trail", this.mesh, this.scene.scene, 0.35, 30, true);
    this.trail.material = new BABYLON.StandardMaterial("cell", this.scene.scene);
    this.trail.material.computeHighLevel = true;
  }

  initPhisics() {
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.mesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 1, friction: 1, restitution: 1 },
      this.scene.scene
    );
    this.mesh.reIntegrateRotationIntoRotationQuaternion = true;

    this.scene.scene.registerBeforeRender(() => {
      this.rays().forEach((ray) => {
        let distance = this.scene.scene.pickWithRay(ray, (mesh) => {
          window.picked = mesh.name;
          return ![this.model.name, "ray"].includes(mesh.name) && ![this.scene.ground.mesh, this.trail].includes(mesh);
        }).distance;
        if (distance != 0 && distance <= 0.5 + 0.2) {
          this.jump = 2;
        }
      });
    });
  }

  spawn() {
    this.respawn();
    this.speed = 0;
    this.jump = 2;
    this.orientation = "front";
    this.lastJump = Date.now();
  }

  rays() {
    var { minimum, maximum } = this.mesh.getBoundingInfo().boundingBox;
    var { x, y, z } = this.mesh.position;

    const offset = 1;
    const scale = 0.8 * offset;
    const topLeft = x + minimum.x * scale;
    const bottomLeft = x + maximum.x * scale;
    const topRight = z + minimum.z * scale;
    const bottomRight = z + maximum.z * scale;
    const height = y + minimum.y * scale;

    return [
      new BABYLON.Vector3(topLeft, height, 0),
      new BABYLON.Vector3(topLeft, height, topRight),
      new BABYLON.Vector3(topLeft, height, bottomRight),
      new BABYLON.Vector3(bottomLeft, height, 0),
      new BABYLON.Vector3(bottomLeft, height, topRight),
      new BABYLON.Vector3(bottomLeft, height, bottomRight),
      new BABYLON.Vector3(x, height, topRight),
      new BABYLON.Vector3(x, height, bottomRight),
      new BABYLON.Vector3(x, height, z),
    ].map((vect) => new BABYLON.Ray(vect, new BABYLON.Vector3(0, -1, 0), 0.5));
  }

  move() {
    this.checkGroundDistance();
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
    this.updateColor();
  }

  checkGroundDistance() {}

  canJump() {
    return this.jump > 0 && Date.now() - this.lastJump > 200;
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
    this.mesh.position = this.lastCheckPointData.position;
    this.orientation = this.lastCheckPointData.orientation;
    this.speed = 0;
    this.mesh.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
    this.mesh.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
    this.resetRotation();
    this.scene.camera.alpha = this.lastCheckPointData.cameraAlpha;
  }
}
