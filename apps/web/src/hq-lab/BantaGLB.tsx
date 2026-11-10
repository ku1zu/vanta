import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { makeToon, useStyle, type GradGroup } from './toon';

/**
 * Drop a real model at apps/web/public/banta.glb.
 * Every mesh gets the lab's toon shader + outline. Material/mesh names containing
 * "hair" / "skin" / "face" / "suit" / "cloth" pick the matching painted-gradient group.
 * Outlines use smooth vertex normals, so export with smooth shading.
 */
export function BantaGLB() {
  const style = useStyle();
  const gltf = useGLTF('/banta.glb');

  const root = useMemo(() => {
    const r = clone(gltf.scene);
    const meshes: THREE.Mesh[] = [];
    r.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
    });
    meshes.forEach((mesh) => {
      const src = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
      const name = `${src.name} ${mesh.name}`.toLowerCase();
      const group: GradGroup = name.includes('hair')
        ? 'hair'
        : name.includes('skin') || name.includes('face')
          ? 'face'
          : name.includes('suit') || name.includes('cloth')
            ? 'suit'
            : 'none';
      const mat = makeToon({ base: '#ffffff', tint: '#a8a8c0', group }, style.shared);
      if (src.map) {
        mat.uniforms.uMap.value = src.map;
        mat.uniforms.uUseMap.value = 1;
      } else {
        mat.uniforms.uBase.value = new THREE.Color(src.color ?? '#ffffff');
      }
      mesh.material = mat;

      const skinned = mesh as THREE.SkinnedMesh;
      let hullMesh: THREE.Mesh;
      if (skinned.isSkinnedMesh) {
        const h = new THREE.SkinnedMesh(mesh.geometry, style.hull);
        h.bind(skinned.skeleton, skinned.bindMatrix);
        hullMesh = h;
      } else {
        hullMesh = new THREE.Mesh(mesh.geometry, style.hull);
      }
      mesh.parent?.add(hullMesh);
    });
    return r;
  }, [gltf, style]);

  return <primitive object={root} />;
}
