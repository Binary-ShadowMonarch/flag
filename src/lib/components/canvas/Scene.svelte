<script lang="ts">
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import * as THREE from 'three';
  import type { FlagDefinition } from '$lib/data/types';
  import { onMount } from 'svelte';

  interface Props {
    flag: FlagDefinition;
    currentStep: number;
    showConstructionLines: boolean;
  }

  let { flag, currentStep = 24, showConstructionLines = true }: Props = $props();

  let flagMesh = $state<THREE.Mesh | null>(null);
  let constructionGroup = $state<THREE.Group | null>(null);
  let decorationGroup = $state<THREE.Group | null>(null);

  // Materials
  const flagMaterial = new THREE.MeshBasicMaterial({ 
    color: '#DC143C',
    side: THREE.DoubleSide
  });
  
  const borderMaterial = new THREE.MeshBasicMaterial({ 
    color: '#003893',
    side: THREE.DoubleSide
  });
  
  const constructionMaterial = new THREE.LineBasicMaterial({ 
    color: '#666666',
    opacity: 0.5,
    transparent: true
  });
  
  const constructionDashedMaterial = new THREE.LineDashedMaterial({ 
    color: '#666666',
    opacity: 0.3,
    transparent: true,
    dashSize: 2,
    gapSize: 1
  });

  const pointMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });

  // Build geometry for current step
  $effect(() => {
    updateGeometry(currentStep);
  });

  function updateGeometry(step: number) {
    if (!constructionGroup || !decorationGroup) return;

    // Clear existing geometry
    constructionGroup.clear();
    decorationGroup.clear();

    // Build geometry up to current step
    const geometry = flag.buildUpToStep ? flag.buildUpToStep(100, step) : flag.buildGeometry(100);

    // Create flag shape
    if (geometry.shape && geometry.shape.length > 0) {
      const shape = new THREE.Shape();
      const firstPoint = geometry.shape[0];
      shape.moveTo(firstPoint.x, -firstPoint.y);
      
      for (let i = 1; i < geometry.shape.length; i++) {
        shape.lineTo(geometry.shape[i].x, -geometry.shape[i].y);
      }
      shape.closePath();

      const flagGeometry = new THREE.ShapeGeometry(shape);
      if (flagMesh) {
        flagMesh.geometry.dispose();
        flagMesh.geometry = flagGeometry;
      }
    }

    // Create construction lines
    if (showConstructionLines && geometry.constructionLines) {
      for (const line of geometry.constructionLines) {
        if (line.type === 'line' && line.points.length >= 2) {
          const points = line.points.map(p => new THREE.Vector3(p.x, -p.y, 0));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMesh = new THREE.Line(
            lineGeometry, 
            line.dashed ? constructionDashedMaterial : constructionMaterial
          );
          if (line.dashed) {
            lineMesh.computeLineDistances();
          }
          constructionGroup.add(lineMesh);
        } else if (line.type === 'point' && line.points.length > 0) {
          for (const point of line.points) {
            const pointGeometry = new THREE.SphereGeometry(1.5, 8, 8);
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.set(point.x, -point.y, 0.1);
            constructionGroup.add(pointMesh);
          }
        } else if (line.type === 'arc' && line.points.length >= 2) {
          const points = line.points.map(p => new THREE.Vector3(p.x, -p.y, 0));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMesh = new THREE.Line(lineGeometry, constructionDashedMaterial);
          constructionGroup.add(lineMesh);
        } else if (line.type === 'circle' && line.points.length >= 2) {
          const points = line.points.map(p => new THREE.Vector3(p.x, -p.y, 0));
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMesh = new THREE.LineLoop(lineGeometry, constructionDashedMaterial);
          constructionGroup.add(lineMesh);
        }
      }
    }

    // Create decorations
    for (const decoration of geometry.decorations) {
      if (decoration.type === 'moon') {
        const moonGroup = createMoon(decoration.scale, decoration.params?.rays || 8);
        moonGroup.position.set(decoration.position.x, -decoration.position.y, decoration.position.z);
        decorationGroup.add(moonGroup);
      } else if (decoration.type === 'sun') {
        const sunGroup = createSun(decoration.scale, decoration.params?.rays || 12);
        sunGroup.position.set(decoration.position.x, -decoration.position.y, decoration.position.z);
        decorationGroup.add(sunGroup);
      }
    }
  }

  function createMoon(scale: number, rays: number): THREE.Group {
    const group = new THREE.Group();
    const moonMaterial = new THREE.MeshBasicMaterial({ color: '#FFFFFF', side: THREE.DoubleSide });

    // Create crescent
    const outerRadius = scale;
    const innerRadius = scale * 0.7;
    const crescentShape = new THREE.Shape();
    
    // Outer arc
    for (let i = 0; i <= 20; i++) {
      const angle = Math.PI * 0.2 + (Math.PI * 1.6 * i) / 20;
      const x = Math.cos(angle) * outerRadius;
      const y = Math.sin(angle) * outerRadius;
      if (i === 0) crescentShape.moveTo(x, y);
      else crescentShape.lineTo(x, y);
    }
    
    // Inner arc (reverse)
    for (let i = 20; i >= 0; i--) {
      const angle = Math.PI * 0.3 + (Math.PI * 1.4 * i) / 20;
      const x = Math.cos(angle) * innerRadius + scale * 0.15;
      const y = Math.sin(angle) * innerRadius;
      crescentShape.lineTo(x, y);
    }
    
    crescentShape.closePath();
    const crescentGeometry = new THREE.ShapeGeometry(crescentShape);
    const crescent = new THREE.Mesh(crescentGeometry, moonMaterial);
    group.add(crescent);

    // Add triangular rays
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 0.5) + (Math.PI * i / rays);
      const rayLength = scale * 0.2;
      const rayWidth = scale * 0.08;
      
      const rayShape = new THREE.Shape();
      rayShape.moveTo(0, 0);
      rayShape.lineTo(-rayWidth / 2, rayLength);
      rayShape.lineTo(rayWidth / 2, rayLength);
      rayShape.closePath();
      
      const rayGeometry = new THREE.ShapeGeometry(rayShape);
      const ray = new THREE.Mesh(rayGeometry, moonMaterial);
      
      const rayDist = outerRadius * 0.85;
      ray.position.x = Math.cos(angle) * rayDist;
      ray.position.y = Math.sin(angle) * rayDist;
      ray.rotation.z = angle - Math.PI / 2;
      
      group.add(ray);
    }

    return group;
  }

  function createSun(scale: number, rays: number): THREE.Group {
    const group = new THREE.Group();
    const sunMaterial = new THREE.MeshBasicMaterial({ color: '#FFFFFF', side: THREE.DoubleSide });

    // Create center circle
    const circleGeometry = new THREE.CircleGeometry(scale * 0.4, 32);
    const circle = new THREE.Mesh(circleGeometry, sunMaterial);
    group.add(circle);

    // Add triangular rays
    for (let i = 0; i < rays; i++) {
      const angle = (Math.PI * 2 * i) / rays;
      const rayLength = scale * 0.6;
      const rayWidth = scale * 0.15;
      
      const rayShape = new THREE.Shape();
      rayShape.moveTo(0, 0);
      rayShape.lineTo(-rayWidth / 2, rayLength);
      rayShape.lineTo(rayWidth / 2, rayLength);
      rayShape.closePath();
      
      const rayGeometry = new THREE.ShapeGeometry(rayShape);
      const ray = new THREE.Mesh(rayGeometry, sunMaterial);
      
      ray.position.x = Math.cos(angle) * scale * 0.4;
      ray.position.y = Math.sin(angle) * scale * 0.4;
      ray.rotation.z = angle - Math.PI / 2;
      
      group.add(ray);
    }

    return group;
  }

  onMount(() => {
    updateGeometry(currentStep);
  });
</script>

<T.PerspectiveCamera makeDefault position={[75, -75, 200]} fov={50}>
  <OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position={[10, 10, 10]} intensity={1} />
<T.AmbientLight intensity={0.6} />

<T.Group position={[-50, 66, 0]}>
  <T.Mesh bind:ref={flagMesh} geometry={new THREE.PlaneGeometry(1, 1)} material={flagMaterial} />
  
  <T.Group bind:ref={constructionGroup} />
  <T.Group bind:ref={decorationGroup} />
</T.Group>

<T.GridHelper args={[200, 20]} />
