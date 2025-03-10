<script lang="ts">
  import TagFilter from '$lib/components/tag-filter.svelte';
  import NoteCard from '$lib/components/note-card.svelte';
  import { notesStore } from '$lib/stores/notes.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Filter } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import type { Note } from '$lib/types';
  import ThemeSwitcher from '$lib/components/theme-switcher.svelte';

  const { getNoteIds, getNote } = notesStore;

  let tagSelectorOpen = $state(false);
  let selectedTags = $state<string[]>([]);

  const noteIds = getNoteIds();
  const allNotes = noteIds.map((id) => getNote(id)).filter(Boolean) as Note[];

  const tagSet = new Set<string>();
  allNotes.forEach((note) => {
    note.tags?.forEach((tag) => tagSet.add(tag));
  });
  const tags = Array.from(tagSet);

  const notes = $derived(
    selectedTags.length > 0
      ? allNotes.filter((note) =>
          selectedTags.some((tag) => note.tags?.includes(tag))
        )
      : allNotes
  );

  function tagSelect(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
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
          aria-label="Filter by tags"
        >
          <Filter class="size-6" />
          {#if selectedTags.length > 0}
            <span
              class="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full size-4 text-xs"
            >
              {selectedTags.length}
            </span>
          {/if}
        </Button>
        {#if tagSelectorOpen}
          <TagFilter
            {tags}
            {selectedTags}
            onClose={() => (tagSelectorOpen = false)}
            onTagSelect={tagSelect}
          />
        {/if}
      </div>
      <Button variant="defaultinv" onclick={() => goto("/note/new")}
        >New Note</Button
      >
    </div>
  </div>

  {#if notes.length === 0}
    <div class="flex flex-col items-center justify-center h-[50vh] text-center">
      <h2 class="text-2xl font-semibold mb-2">No notes found</h2>
      <p class="text-muted-foreground mb-4">
        {selectedTags.length > 0
          ? "Try changing your tag filters or creating a new note"
          : "Create a note to get started"}
      </p>
      <Button onclick={() => goto("/note/new")}>Create your first Note</Button>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
      {#each notes as note (note.id)}
        <NoteCard {note} />
      {/each}
    </div>
  {/if}
  <div class="fixed bottom-4 right-4 z-10">
    <ThemeSwitcher />
  </div>
</main>
