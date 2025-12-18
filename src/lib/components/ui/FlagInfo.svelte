<!-- src/lib/components/ui/FlagInfo.svelte -->
<script lang="ts">
	import type { FlagDefinition } from '$lib/data/types';

	interface Props {
		flag: FlagDefinition;
		onClose: () => void;
	}

	let { flag, onClose }: Props = $props();
</script>

<div class="info-panel">
	<div class="info-header">
		<h3 class="info-title">{flag.country}</h3>
		<button class="close-btn" onclick={onClose}>✕</button>
	</div>

	<p class="info-detail">
		<strong>Official Source:</strong>
		{flag.officialSource}
	</p>

	<p class="info-description">
		This flag is constructed following the exact geometric specifications outlined in Nepal's
		Constitution, Schedule-1, Article 8. The double-pennon shape is unique among world flags.
	</p>

	<div class="color-swatches">
		<span class="swatch" style="background-color: {flag.colors.primary}">Crimson</span>
		<span class="swatch" style="background-color: {flag.colors.border}">Deep Blue</span>
		<span class="swatch white" style="background-color: {flag.colors.secondary}">White</span>
	</div>
</div>

<style>
	.info-panel {
		position: absolute;
		top: 1rem;
		left: 1rem;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(10px);
		color: white;
		padding: 1rem;
		border-radius: 0.5rem;
		max-width: 24rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.info-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.info-title {
		font-weight: bold;
		font-size: 1.125rem;
		margin: 0;
	}

	.close-btn {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: white;
	}

	.info-detail {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 0.5rem;
	}

	.info-description {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.5;
		margin-bottom: 0.75rem;
	}

	.color-swatches {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.swatch {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.swatch.white {
		color: black;
	}
</style>
