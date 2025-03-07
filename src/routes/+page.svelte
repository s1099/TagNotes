<script lang="ts">
  import TagFilter from '$lib/components/tag-filter.svelte';
  import NoteCard from '$lib/components/note-card.svelte';

  import { Button } from '$lib/components/ui/button';
  import { Filter } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import type { Note } from '$lib/types';

  let notes = $state<Note[]>([
    {
      id: '1',
      title: 'aaaaaaaaaaaa',
      content: 'eeeeeeeeeeeeeeee',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: []
    },
    {
      id: '2',
      title: 'aaaaaaa',
      content: 'eeeeeeeeeeeeeee',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: []
    },
    {
      id: '3',
      title: 'aaaaaaa',
      content: 'eeeeeeeeeeeeee',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: ['e']
    }
  ]);
  let tags = $state(['e', 'q', 'w']);
  let tagSelectorOpen = $state(false);
  let selectedTags = $state(['q']);
</script>

<main class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Notes</h1>
    <div class="flex items-center gap-2">
      <div class="relative">
        <Button
          variant="outline"
          size="icon"
          onclick={() => (tagSelectorOpen = !tagSelectorOpen)}
          aria-label="Filter tag"
        >
          <Filter class="size-6" />
        </Button>
        {#if tagSelectorOpen}
          <TagFilter
            {tags}
            {selectedTags}
            onClose={() => (tagSelectorOpen = false)}
            onTagSelect={(tag: any) => console.log(tag)}
          />
        {/if}
      </div>
      <Button onclick={() => goto('/note/new')}>New Note</Button>
    </div>
  </div>

  {#if notes.length === 0}
    <div class="flex flex-col items-center justify-center h-[50vh] text-center">
      <h2 class="text-2xl font-semibold mb-2">No notes found</h2>
      <p class="text-muted-foreground mb-4">
        {selectedTags.length > 0
          ? 'Try changing your tag filters or creating a new note'
          : 'Create a note to get started'}
      </p>
      <Button onclick={() => goto('/note/new')}>Create your first Note</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
      {#each notes as note (note.id)}
        <NoteCard {note} />
      {/each}
    </div>
  {/if}
</main>
