<script lang="ts">
  import { Canvas } from '@threlte/core';
  import Scene from '$lib/components/canvas/Scene.svelte';
  import FlagInfo from '$lib/components/ui/FlagInfo.svelte';
  import { getFlag } from '$lib/data/flags';
  import { onMount } from 'svelte';

  const flag = getFlag('nepal')!;

  let currentStep = $state(1);
  let isPlaying = $state(false);
  let showConstructionLines = $state(true);
  let animationSpeed = $state(1);
  let showInfo = $state(true);
  let animationTimer: number;

  function play() {
    if (currentStep >= flag.constructionSteps.length) {
      currentStep = 1;
    }
    isPlaying = true;
    animateStep();
  }

  function pause() {
    isPlaying = false;
    if (animationTimer) {
      clearTimeout(animationTimer);
    }
  }

  function animateStep() {
    if (!isPlaying) return;

    if (currentStep < flag.constructionSteps.length) {
      const step = flag.constructionSteps[currentStep - 1];
      const duration = (step.duration || 2) * 1000 / animationSpeed;
      
      animationTimer = window.setTimeout(() => {
        currentStep++;
        animateStep();
      }, duration);
    } else {
      isPlaying = false;
    }
  }

  function nextStep() {
    if (currentStep < flag.constructionSteps.length) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function reset() {
    pause();
    currentStep = 1;
  }

  function jumpToStep(step: number) {
    pause();
    currentStep = Math.max(1, Math.min(step, flag.constructionSteps.length));
  }

  $effect(() => {
    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  });
</script>

<svelte:head>
  <title>Nepal Flag Construction - Animated</title>
</svelte:head>

<div class="container">
  <Canvas>
    <Scene {flag} {currentStep} {showConstructionLines} />
  </Canvas>

  {#if showInfo}
    <FlagInfo {flag} onClose={() => showInfo = false} />
  {/if}

  <div class="controls-panel">
    <div class="controls-header">
      <h3>Construction Steps</h3>
      <button class="info-toggle" onclick={() => showInfo = !showInfo}>
        {showInfo ? '✕ Info' : 'ℹ Info'}
      </button>
    </div>

    <div class="step-indicator">
      <div class="step-number">Step {currentStep} / {flag.constructionSteps.length}</div>
      <div class="step-description">
        {flag.constructionSteps[currentStep - 1]?.description || ''}
      </div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width: {(currentStep / flag.constructionSteps.length) * 100}%"></div>
    </div>

    <div class="playback-controls">
      <button onclick={reset} title="Reset">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
      </button>

      <button onclick={prevStep} disabled={currentStep <= 1} title="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>

      {#if isPlaying}
        <button class="play-pause" onclick={pause} title="Pause">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        </button>
      {:else}
        <button class="play-pause" onclick={play} title="Play">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      {/if}

      <button onclick={nextStep} disabled={currentStep >= flag.constructionSteps.length} title="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>

      <button 
        onclick={() => jumpToStep(flag.constructionSteps.length)} 
        title="Jump to End"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 19 22 12 13 5 13 19"></polygon>
          <polygon points="2 19 11 12 2 5 2 19"></polygon>
        </svg>
      </button>
    </div>

    <div class="settings">
      <label class="setting-row">
        <span>Construction Lines</span>
        <input type="checkbox" bind:checked={showConstructionLines} />
      </label>

      <label class="setting-row">
        <span>Speed: {animationSpeed.toFixed(1)}x</span>
        <input 
          type="range" 
          min="0.1" 
          max="3" 
          step="0.1" 
          bind:value={animationSpeed}
          class="speed-slider"
        />
      </label>
    </div>

    <div class="step-list">
      {#each flag.constructionSteps as step, i}
        <button
          class="step-item"
          class:active={currentStep === step.step}
          onclick={() => jumpToStep(step.step)}
        >
          <span class="step-num">{step.step}</span>
          <span class="step-desc">{step.description}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .container {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  }

  .controls-panel {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    color: white;
    padding: 1.5rem;
    border-radius: 1rem;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .controls-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .info-toggle {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .info-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .step-indicator {
    margin-bottom: 1rem;
  }

  .step-number {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #4fc3f7;
  }

  .step-description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4fc3f7, #29b6f6);
    transition: width 0.3s ease;
  }

  .playback-controls {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .playback-controls button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .playback-controls button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  .playback-controls button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .playback-controls button.play-pause {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #4fc3f7, #29b6f6);
  }

  .playback-controls button.play-pause:hover {
    background: linear-gradient(135deg, #29b6f6, #0288d1);
  }

  .settings {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }

  .setting-row:last-child {
    margin-bottom: 0;
  }

  .setting-row input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .speed-slider {
    width: 120px;
    cursor: pointer;
  }

  .step-list {
    max-height: 300px;
    overflow-y: auto;
    margin: -0.5rem;
    padding: 0.5rem;
  }

  .step-item {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
    text-align: left;
  }

  .step-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .step-item.active {
    background: linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(41, 182, 246, 0.2));
    border-color: #4fc3f7;
  }

  .step-num {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 32px;
    text-align: center;
  }

  .step-item.active .step-num {
    background: #4fc3f7;
    color: #000;
  }

  .step-desc {
    font-size: 0.875rem;
    line-height: 1.4;
    flex: 1;
  }

  .controls-panel::-webkit-scrollbar,
  .step-list::-webkit-scrollbar {
    width: 8px;
  }

  .controls-panel::-webkit-scrollbar-track,
  .step-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  .controls-panel::-webkit-scrollbar-thumb,
  .step-list::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }

  .controls-panel::-webkit-scrollbar-thumb:hover,
  .step-list::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
</style>
