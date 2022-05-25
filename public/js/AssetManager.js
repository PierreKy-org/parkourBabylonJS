export default class AssetsManager {
  Models = {};
  Materials = {};
  Audio = {};
  Guis = {};

  constructor(scene, assets) {
    var { models, materials, guis, audio } = assets;

    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      this.Models[task.name] = { name: task.name, meshes: task.loadedMeshes };
      task.loadedMeshes.forEach((mesh) => mesh.setEnabled(false));
    });

    //Models
    var keys = Object.keys(models);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", models[key].path, models[key].model);
    });

    //Materials
    this.materials = materials.map((mat) => BABYLON.NodeMaterial.ParseFromFileAsync(mat.name, mat.path, scene.scene));

    //Gui
    this.guis = guis;

    //Audios
    var keys = Object.keys(audio);
    this.audios = keys.map((key) => {
      return new Promise((resolve, reject) => {
        this.Audio[key] = new BABYLON.Sound(key, audio[key].path, scene.scene, () => resolve(), {
          loop: audio[key].loop,
        });
      });
    });
  }

  async load() {
    await this.assetsManager.loadAsync();

    let materials = await Promise.all(this.materials);
    materials.forEach((mat) => {
      this.Materials[mat.name] = mat;
    });

    let res = await Promise.all(this.guis.map((path) => fetch(path)));
    let jsons = await Promise.all(res.map((r) => r.json()));
    jsons.forEach((txt) => {
      this.Guis[txt.root.name] = txt;
    });

    await Promise.all(this.audios);
  }
}
