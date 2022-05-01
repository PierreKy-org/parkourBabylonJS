export default class ReduceSpeed {
    constructor(pX, pY, pZ, scene) {
      this.scene = scene;
      this.initInstance(pX, pY, pZ);
      this.setPhysics(pX, pY, pZ);
    }
  
    initInstance(pX, pY, pZ) {
      if (ReduceSpeed.builder && ReduceSpeed.builder._scene != this.scene.scene) {
        ReduceSpeed.builder.dispose();
        ReduceSpeed.builder = undefined;
      }
  
      if (!ReduceSpeed.builder) {
        ReduceSpeed.builder = BABYLON.MeshBuilder.CreateBox("box", {
          height: 1,
          width: 1,
          depth: 1,
        });
        ReduceSpeed.builder.name = `reducespeed_${pX}_${pY}_${pZ}`;
  
        ReduceSpeed.builder.material = new BABYLON.GradientMaterial("grad", this.scene.scene);
        ReduceSpeed.builder.material.topColor = new BABYLON.Color3(1, 0, 0);
        ReduceSpeed.builder.material.bottomColor = new BABYLON.Color3(0, 0, 0);
        ReduceSpeed.builder.material.offset = 0.6;
  
        ReduceSpeed.builder.material.disableLighting = true;
  
        this.box = ReduceSpeed.builder;
      } else {
        this.box = ReduceSpeed.builder.createInstance(`reducespeed_${pX}_${pY}_${pZ}`);
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
      if(this.scene.player.maxSpeed > 5 && this.scene.player.valueJump > 6){
        this.scene.player.maxSpeed -= 10
        this.scene.player.valueJump -= 2
        BABYLON.ParticleHelper.ParseFromFileAsync(
            "reducespeed",
            "../../assets/particles/reducespeed.json",
            this.scene.scene
          ).then((sys) => (sys.emitter = this.scene.player.mesh.position));
      }
    }
  }
  