export default class AssetsManager {
  Assets = {};

  constructor(scene, assets) {
    this.assetsManager = new BABYLON.AssetsManager(scene);

    this.assetsManager.onTaskSuccessObservable.add((task) => {
      var mesh = task.loadedMeshes[0];
      var { name, bbox } = this.getModelBBox(mesh);
      mesh.setBoundingInfo(bbox);

      this.Assets[task.name] = { name, mesh };
    });

    var keys = Object.keys(assets);
    keys.forEach((key) => {
      this.assetsManager.addMeshTask(key, "", assets[key].path, assets[key].gltf);
    });

    this.assetsManager.load();
  }

  getModelBBox(mesh) {
    while (mesh._children != null) {
      mesh = mesh._children[0];
    }
    var bbox = mesh.getBoundingInfo().boundingBox;
    return { name: mesh.name, bbox: new BABYLON.BoundingInfo(bbox.minimum, bbox.maximum) };
  }
}
