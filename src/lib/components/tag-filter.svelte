<script lang="ts">
	import { Check } from 'lucide-svelte';

	const {
		tags = [],
		selectedTags = [],
		onTagSelect,
		onClose
	} = $props<{
		tags: string[];
		selectedTags: string[];
		onTagSelect: (tag: string) => void;
		onClose: () => void;
	}>();

	let tagSelectorElement = $state<HTMLDivElement | null>(null);

	function handleClickOutside(event: MouseEvent): void {
		if (tagSelectorElement && !tagSelectorElement.contains(event.target as Node)) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent, tag: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onTagSelect(tag);
		}
	}

	$effect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
</script>

<div
	bind:this={tagSelectorElement}
	class="absolute right-0 top-10 z-10 w-56 bg-background border rounded-md shadow-md p-2"
>
	<div class="text-sm font-medium mb-2 px-2">Filter by tag</div>
	{#if tags.length === 0}
		<p class="text-sm text-muted-foreground p-2">No tags</p>
	{:else}
		<div class="max-h-60 overflow-y-auto">
			{#each tags as tag}
				<button
					type="button"
					class="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-muted rounded-sm"
					onclick={() => onTagSelect(tag)}
					onkeydown={(e) => handleKeydown(e, tag)}
				>
					<span class="text-sm">{tag}</span>
					{#if selectedTags.includes(tag)}
						<Check class="h-4 w-4" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- TODO: count for each tag -->