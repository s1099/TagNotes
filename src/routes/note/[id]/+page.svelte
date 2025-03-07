<script lang="ts">
  import type { Note } from '$lib/types';
  import { page } from '$app/stores';
  import { notesStore } from '$lib/stores/notes.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, Save, Trash } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { Input } from '$lib/components/ui/input';

  const { getNote, updateNote, createNote, deleteNote, tags } = notesStore;

  let note = $state<Note | null>(null);
  const noteId = $page.params.id;
  const isNew = noteId === 'new';
  let title = $state('');

  $effect(() => {
    if (note) {
      title = note.title || '';
    }
  });

  function addNote() {
    if (isNew) {
      createNote({
        title,
        content: 'test',
        tags: ['xyz']
      });
      goto('/');
    }
    // else {
    //   updateNote(noteId, { title });
    // }
  }
</script>

<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <Button variant="ghost" onclick={() => goto('/')} class="gap-2">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
    <div class="flex items-center gap-2">
      {#if !isNew}
        <Button variant="destructive" onclick={() => deleteNote(noteId)} size="icon">
          <Trash class="h-4 w-4" />
        </Button>
      {/if}
      <Button onclick={() => addNote()} class="gap-2">
        <Save class="h-4 w-4" />
        Save
      </Button>
    </div>
  </div>
  <div class="space-y-4">
    <Input
      type="text"
      placeholder="Note Title"
      bind:value={title}
      class="text-5xl font-bold border-none focus-visible:ring-0 p-3 h-auto placeholder:text-muted-foreground/50"
    />
  </div>
</div>
