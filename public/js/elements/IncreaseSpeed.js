export default class IncreaseSpeed {
    constructor(pX, pY, pZ, scene) {
      this.scene = scene;
      this.initInstance(pX, pY, pZ);
      this.setPhysics(pX, pY, pZ);
    }
  
    initInstance(pX, pY, pZ) {
      if (IncreaseSpeed.builder && IncreaseSpeed.builder._scene != this.scene.scene) {
        IncreaseSpeed.builder.dispose();
        IncreaseSpeed.builder = undefined;
      }
  
      if (!IncreaseSpeed.builder) {
        IncreaseSpeed.builder = BABYLON.MeshBuilder.CreateBox("box", {
          height: 1,
          width: 1,
          depth: 1,
        });
        IncreaseSpeed.builder.name = `increasespeed_${pX}_${pY}_${pZ}`;
  
        IncreaseSpeed.builder.material = new BABYLON.GradientMaterial("grad", this.scene.scene);
        IncreaseSpeed.builder.material.topColor = new BABYLON.Color3(0, 1, 0);
        IncreaseSpeed.builder.material.bottomColor = new BABYLON.Color3(0, 0, 0);
        IncreaseSpeed.builder.material.offset = 0.6;
  
        IncreaseSpeed.builder.material.disableLighting = true;
  
        this.box = IncreaseSpeed.builder;
      } else {
        this.box = IncreaseSpeed.builder.createInstance(`increasespeed_${pX}_${pY}_${pZ}`);
      }
      this.box.alwaysSelectAsActiveMesh = true;
      this.box.position = new BABYLON.Vector3(pX, pY, pZ);
    }
  
    setPhysics() {
      this.box.checkCollisions = true;
      this.box.physicsImpostor = new BABYLON.PhysicsImpostor(
        this.box,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 0 },
        this.scene.scene
      );
  
      this.box.actionManager = new BABYLON.ActionManager(this.scene.scene);
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
  
    onPlayerCollision() {
      if(this.scene.player.maxSpeed < 25 && this.scene.player.valueJump < 10){
        this.scene.player.maxSpeed += 10
        this.scene.player.valueJump += 2
      }
    }
  }
  