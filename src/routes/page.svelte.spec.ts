import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import // src/routes/+page.svelte
<script lang="ts">
  import FlagCanvas from '$lib/components/canvas/FlagCanvas.svelte';
  import AnimationControls from '$lib/components/ui/AnimationControls.svelte';
  import FlagInfo from '$lib/components/ui/FlagInfo.svelte';
  import { nepalFlag } from '$lib/data/flags/nepal';
  import { Play, Pause, RotateCcw } from 'lucide-svelte';

  // Reactive state using Svelte 5 runes
  let windStrength = $state(0.5);
  let animationSpeed = $state(1.0);
  let isPlaying = $state(true);
  let showSteps = $state(false);
  let showInfo = $state(true);

  // Current flag
  const currentFlag = $state(nepalFlag);

  function handleReset() {
    windStrength = 0.5;
    animationSpeed = 1.0;
    isPlaying = true;
  }

  function togglePlayPause() {
    isPlaying = !isPlaying;
  }
</script>

<div class="app-container">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <h1 class="title">🏴 Constitutional Flag Builder</h1>
      <p class="subtitle">
        Building flags with official government specifications • Currently viewing:
        <span class="flag-name">{currentFlag.name}</span>
      </p>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Canvas Area -->
    <div class="canvas-container">
      <FlagCanvas
        flag={currentFlag}
        {windStrength}
        {animationSpeed}
        {isPlaying}
        {showSteps}
      />

      <!-- Info Overlay -->
      {#if showInfo}
        <FlagInfo
          flag={currentFlag}
          onClose={() => showInfo = false}
        />
      {/if}
    </div>

    <!-- Control Panel -->
    <aside class="control-panel">
      <AnimationControls
        bind:windStrength
        bind:animationSpeed
        bind:isPlaying
        bind:showSteps
        onReset={handleReset}
      />

      <!-- Constitutional Info -->
      <div class="constitutional-info">
        <h3 class="info-title">📜 Constitutional Specs</h3>
        <p class="info-text">
          Nepal's flag is the only non-rectangular national flag in the world.
          Its construction involves 24 precise steps using geometric constructions
          with circles, arcs, and triangles. The moon represents peace, while the
          sun symbolizes resolve.
        </p>
      </div>

      <!-- Show Info Button -->
      {#if !showInfo}
        <button class="btn-secondary" onclick={() => showInfo = true}>
          Show Flag Info
        </button>
      {/if}
    </aside>
  </main>

  <!-- Footer -->
  <footer class="footer">
    Built with constitutional accuracy • Open source • Add your country's flag specifications
  </footer>
</div>

<style>
  .app-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #020617;
    color: white;
  }

  .header {
    background: linear-gradient(to right, #1e3a8a, #581c87);
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  .header-content {
    max-width: 100%;
  }

  .title {
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .subtitle {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .flag-name {
    font-weight: 600;
    color: #fef08a;
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .canvas-container {
    flex: 1;
    position: relative;
    background: #0f172a;
  }

  .control-panel {
    width: 20rem;
    background: #0f172a;
    padding: 1.5rem;
    overflow-y: auto;
    border-left: 1px solid #1e293b;
  }

  .constitutional-info {
    margin-top: 2rem;
    padding: 1rem;
    background: #1e293b;
    border-radius: 0.5rem;
  }

  .info-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .info-text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
  }

  .btn-secondary {
    width: 100%;
    margin-top: 1rem;
    padding: 0.5rem 0.75rem;
    background: #334155;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-secondary:hover {
    background: #475569;
  }

  .footer {
    background: #0f172a;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
    padding: 0.75rem;
    text-align: center;
    border-top: 1px solid #1e293b;
  }
</style> from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', async () => {
		render(Page);

		const heading = page.getByRole('heading', { level: 1 });
		await expect.element(heading).toBeInTheDocument();
	});
});
