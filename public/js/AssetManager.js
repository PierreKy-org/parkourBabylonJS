export default class AssetsManager {
  Assets = {};
  Materials = {};

  constructor(scene, assets) {
    var { models, materials } = assets;

    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      this.Assets[task.name] = { name: task.name, meshes: task.loadedMeshes };
    });

    var keys = Object.keys(models);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", models[key].path, models[key].gltf);
    });

    var keys = Object.keys(materials);
    this.materials = keys.map((key) =>
      BABYLON.NodeMaterial.ParseFromFileAsync(materials[key].name, materials[key].path, scene.scene)
    );
  }

  async load() {
    await this.assetsManager.loadAsync();

    let materials = await Promise.all(this.materials);
    materials.forEach((mat) => {
      this.Materials[mat.name] = mat;
    });
  }
}
