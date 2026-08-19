import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { RotateCw, ZoomIn, ZoomOut, Layers, Sparkles, RefreshCw, Scissors, Flame, Heart } from 'lucide-react';

export const Interactive3DGabin: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { previewFlavor, flavors, setPreviewFlavorId, addToCart, showToast } = useApp();
  const [isExploded, setIsExploded] = useState(false);
  const [isSliced, setIsSliced] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const topCrackerRef = useRef<THREE.Mesh | null>(null);
  const flaFillingRef = useRef<THREE.Mesh | null>(null);
  const bottomCrackerRef = useRef<THREE.Mesh | null>(null);
  const sugarParticlesRef = useRef<THREE.Points | null>(null);

  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 4.4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff9f2, 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
    dirLight.position.set(5, 8, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xffc58a, 1.4);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffe8d1, 1.0, 10);
    pointLight.position.set(0, -2, 3);
    scene.add(pointLight);

    // GABIN MODEL GROUP
    const gabinGroup = new THREE.Group();
    modelGroupRef.current = gabinGroup;
    scene.add(gabinGroup);

    // PROCEDURAL CRACKER TEXTURE GENERATION
    const makeCrackerCanvas = () => {
      const cv = document.createElement('canvas');
      cv.width = 512;
      cv.height = 512;
      const ctx = cv.getContext('2d')!;

      // Baked golden cracker background with delicious toasted edges
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 280);
      grad.addColorStop(0, '#F7B45B');
      grad.addColorStop(0.4, '#E59B3C');
      grad.addColorStop(0.8, '#D08122');
      grad.addColorStop(1, '#8C460D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Cracker perimeter border indent
      ctx.strokeStyle = '#783A09';
      ctx.lineWidth = 14;
      ctx.strokeRect(16, 16, 480, 480);

      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 4;
      ctx.strokeRect(28, 28, 456, 456);

      // Distinct Gabin 3x3 Perforation Holes
      const pinPositions = [115, 256, 397];
      pinPositions.forEach((x) => {
        pinPositions.forEach((y) => {
          ctx.beginPath();
          ctx.arc(x, y, 13, 0, Math.PI * 2);
          ctx.fillStyle = '#5A2B07';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x - 2, y - 2, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FED7AA';
          ctx.fill();
        });
      });

      // Baked speckled crunch dots
      for (let i = 0; i < 350; i++) {
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        const size = Math.random() * 2.8 + 0.5;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(90, 43, 7, 0.3)' : 'rgba(254, 243, 199, 0.45)';
        ctx.beginPath();
        ctx.arc(rx, ry, size, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(cv);
    };

    const crackerTexture = makeCrackerCanvas();
    crackerTexture.wrapS = THREE.ClampToEdgeWrapping;
    crackerTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Cracker Geometry
    const crackerGeo = new THREE.BoxGeometry(2.15, 0.16, 2.15, 16, 4, 16);
    const crackerMat = new THREE.MeshStandardMaterial({
      map: crackerTexture,
      roughness: 0.6,
      metalness: 0.04,
      bumpMap: crackerTexture,
      bumpScale: 0.05,
    });

    // Top Cracker
    const topCracker = new THREE.Mesh(crackerGeo, crackerMat);
    topCracker.position.y = 0.38;
    topCracker.castShadow = true;
    topCracker.receiveShadow = true;
    gabinGroup.add(topCracker);
    topCrackerRef.current = topCracker;

    // Bottom Cracker
    const bottomCracker = new THREE.Mesh(crackerGeo, crackerMat.clone());
    bottomCracker.position.y = -0.38;
    bottomCracker.castShadow = true;
    bottomCracker.receiveShadow = true;
    gabinGroup.add(bottomCracker);
    bottomCrackerRef.current = bottomCracker;

    // Luscious Creamy Fla Filling Geometry
    const flaGeo = new THREE.BoxGeometry(2.06, 0.56, 2.06, 24, 8, 24);
    const flaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(previewFlavor.flaColorHex),
      roughness: 0.28,
      metalness: 0.06,
      bumpScale: 0.02,
    });
    const flaFilling = new THREE.Mesh(flaGeo, flaMat);
    flaFilling.position.y = 0;
    flaFilling.castShadow = true;
    flaFilling.receiveShadow = true;
    gabinGroup.add(flaFilling);
    flaFillingRef.current = flaFilling;

    // SUGAR CRYSTALS SCATTERED ON TOP
    const sugarCount = 180;
    const sugarPositions = new Float32Array(sugarCount * 3);
    for (let i = 0; i < sugarCount; i++) {
      sugarPositions[i * 3] = (Math.random() - 0.5) * 1.95;
      sugarPositions[i * 3 + 1] = 0.48 + Math.random() * 0.02;
      sugarPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.95;
    }
    const sugarGeo = new THREE.BufferGeometry();
    sugarGeo.setAttribute('position', new THREE.BufferAttribute(sugarPositions, 3));
    const sugarMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const sugarPoints = new THREE.Points(sugarGeo, sugarMat);
    gabinGroup.add(sugarPoints);
    sugarParticlesRef.current = sugarPoints;

    // SOFT FLOOR SHADOW
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x24160e,
      transparent: true,
      opacity: 0.16,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.25;
    scene.add(shadowMesh);

    // Initial Angle
    gabinGroup.rotation.x = 0.42;
    gabinGroup.rotation.y = 0.65;

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDraggingRef.current && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.007;
      }

      // Gentle floating bob
      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.6) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      crackerTexture.dispose();
      crackerGeo.dispose();
      crackerMat.dispose();
      flaGeo.dispose();
      flaMat.dispose();
      sugarGeo.dispose();
      sugarMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
    };
  }, []);

  // Update Fla Color
  useEffect(() => {
    if (flaFillingRef.current && previewFlavor) {
      const mat = flaFillingRef.current.material as THREE.MeshStandardMaterial;
      mat.color.set(previewFlavor.flaColorHex);

      if (previewFlavor.id === 'rich-chocolate' || previewFlavor.id === 'espresso-blend') {
        mat.roughness = 0.42;
      } else if (previewFlavor.id === 'kyoto-matcha') {
        mat.roughness = 0.5;
      } else {
        mat.roughness = 0.26;
      }
    }
  }, [previewFlavor]);

  // Exploded View Effect
  useEffect(() => {
    if (topCrackerRef.current && bottomCrackerRef.current && sugarParticlesRef.current) {
      const targetTopY = isExploded ? 0.95 : 0.38;
      const targetBottomY = isExploded ? -0.95 : -0.38;
      const targetSugarY = isExploded ? 0.57 : 0;

      topCrackerRef.current.position.y = targetTopY;
      bottomCrackerRef.current.position.y = targetBottomY;
      sugarParticlesRef.current.position.y = targetSugarY;
    }
  }, [isExploded]);

  // Sliced / Half Cross Section View Effect
  useEffect(() => {
    if (modelGroupRef.current) {
      if (isSliced) {
        modelGroupRef.current.rotation.x = 0.15;
        modelGroupRef.current.rotation.y = 1.57; // Look directly at the side profile
      }
    }
  }, [isSliced]);

  // Zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 4.4 / zoomLevel;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [zoomLevel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - prevMousePosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.009;
    modelGroupRef.current.rotation.x += deltaY * 0.009;

    prevMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const resetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.x = 0.42;
      modelGroupRef.current.rotation.y = 0.65;
    }
    setZoomLevel(1);
    setIsExploded(false);
    setIsSliced(false);
  };

  return (
    <div id="interactive-3d-experience" className="relative w-full rounded-3xl bg-gradient-to-b from-[#FFF5EB] via-[#FFF9F2] to-[#FFF1DE] border border-[#F2DECC] p-4 sm:p-6 shadow-xl overflow-hidden">
      {/* Decorative ambient color glow matching active flavor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45 transition-colors duration-700 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${previewFlavor.flaColorHex}66 0%, transparent 65%)`,
        }}
      />

      {/* Top Header Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#E88C38]/15 text-[#C46A18]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#3B281B] tracking-tight">
                Studio 3D Gabin Fla
              </h3>
              <span className="rounded-full bg-[#E88C38] px-2 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                360° View
              </span>
            </div>
            <p className="text-xs text-[#7A6455]">
              Putar 360°, intip lapisan custard tebal, & klik rasa untuk ganti tampilan
            </p>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-[#ECD9C7] shadow-sm flex-wrap">
          <button
            id="toggle-exploded-view"
            type="button"
            onClick={() => {
              setIsExploded(!isExploded);
              if (isSliced) setIsSliced(false);
            }}
            title={isExploded ? 'Satukan Gabin' : 'Buka Lapisan (Exploded View)'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isExploded
                ? 'bg-[#E88C38] text-white shadow-sm'
                : 'text-[#61493C] hover:bg-[#FBECE0]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{isExploded ? 'Tutup Fla' : 'Intip Lapisan'}</span>
          </button>

          <button
            id="toggle-sliced-view"
            type="button"
            onClick={() => {
              setIsSliced(!isSliced);
              if (isExploded) setIsExploded(false);
            }}
            title="Lihat Profil Samping Fla"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSliced
                ? 'bg-[#3B281B] text-white shadow-sm'
                : 'text-[#61493C] hover:bg-[#FBECE0]'
            }`}
          >
            <Scissors className="h-3.5 w-3.5" />
            <span>Profil Samping</span>
          </button>

          <button
            id="toggle-auto-rotate"
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Putar Otomatis"
            className={`p-1.5 rounded-lg text-xs transition-all ${
              autoRotate
                ? 'bg-[#FBECE0] text-[#C46A18] font-bold'
                : 'text-[#7A6455] hover:bg-[#F5E6D8]'
            }`}
          >
            <RotateCw className="h-4 w-4" />
          </button>

          <button
            id="zoom-in-3d"
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            title="Perbesar"
            className="p-1.5 rounded-lg text-[#7A6455] hover:bg-[#F5E6D8] transition-colors"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            id="zoom-out-3d"
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            title="Perkecil"
            className="p-1.5 rounded-lg text-[#7A6455] hover:bg-[#F5E6D8] transition-colors"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            id="reset-3d-view"
            type="button"
            onClick={resetView}
            title="Reset Sudut Pandang"
            className="p-1.5 rounded-lg text-[#7A6455] hover:bg-[#F5E6D8] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-0 h-64 sm:h-80 w-full cursor-grab active:cursor-grabbing touch-none select-none my-1"
      />

      {/* Bottom Interactive Flavor Switcher & Quick Add */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#EED7C2]/80">
        {/* Active Flavor Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className="h-10 w-10 rounded-2xl border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: previewFlavor.flaColorHex,
              color: ['classic-vanilla'].includes(previewFlavor.id) ? '#3B281B' : '#FFFFFF',
            }}
          >
            Fla
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#3B281B] truncate">{previewFlavor.name}</h4>
            <p className="text-xs text-[#8A6F5C] truncate">
              {previewFlavor.subtitle} • Rp {previewFlavor.price.toLocaleString('id-ID')} / pcs
            </p>
          </div>
        </div>

        {/* Flavor Pills & Quick Add to Order */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {flavors.slice(0, 5).map((flv) => (
              <button
                key={flv.id}
                id={`switch-3d-flavor-${flv.id}`}
                type="button"
                onClick={() => setPreviewFlavorId(flv.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  previewFlavor.id === flv.id
                    ? 'bg-[#3B281B] text-white border-[#3B281B] shadow-md scale-105'
                    : 'bg-white/90 text-[#5C4537] border-[#ECD7C4] hover:bg-[#FAF0E6]'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-black/10 flex-shrink-0"
                  style={{ backgroundColor: flv.flaColorHex }}
                />
                <span>{flv.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              addToCart(previewFlavor.id, 1);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E88C38] hover:bg-[#D57924] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap active:scale-95 ml-1"
          >
            <Heart className="h-3 w-3 fill-white" />
            <span>+ Pesan Rasa Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
