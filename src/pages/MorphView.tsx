import React, { useEffect, useRef } from "react";
import {
  Scene,
  Engine,
  ArcRotateCamera,
  Vector3,
  SceneLoader
} from "@babylonjs/core";
import "@babylonjs/loaders";
import {
  GLTF2Export,
  GLTFData,
} from "babylonjs-serializers";
import 'babylonjs-inspector';
import "./_styling/morphView.css";

const MorphView: React.FC = () => {
  const sceneCanvas: any = useRef(null);
  var scene: Scene;

  useEffect(() => {
    if(!sceneCanvas.current) return;
    scene = createScene();
    return () => scene.getEngine().dispose();
  }, [sceneCanvas]);

  const createScene = () => {
    const engine = new Engine(sceneCanvas.current, true);
    scene = new Scene(engine);

    if (scene.isReady()) { 
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) =>
        onSceneReady(scene)
      );
    }
    engine.runRenderLoop(() => {
      scene.render();
    });
    return scene;
  };

  const onSceneReady = (scene: any) => {
    scene.debugLayer.show();
    
    const camera1 = new ArcRotateCamera(
      "camera1",
      Math.PI * 0.5,
      Math.PI * 0.5,
      45,
      new Vector3(0, 15, 0)
    );
    camera1.attachControl(sceneCanvas, true);
    
    // Import mesh
    SceneLoader.ImportMesh(
      "",
      "assets/",
      "BoomBox.glb",
      scene,
      function (meshes) {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.createDefaultEnvironment();
      },
      undefined,
      undefined,
      ".glb"
    ); //end loader
  };

  const downloadMorph = (scene: any) => {
    var filename = "mesh-test";
    
    if (!(scene === undefined)) { 
      console.log(scene.meshes);
      GLTF2Export.GLBAsync(scene, filename)
        .then((glb: GLTFData) => {
          glb.downloadFiles();
        }); 
    } else {
      console.log("Could not load mesh.");
    }
  }

  return (
    <div id="morph-view">
      <b>Morph View</b>
      <canvas ref={sceneCanvas} />
      <button onClick={() => downloadMorph(scene)}>Download</button>
    </div>
  );
};

export default MorphView;