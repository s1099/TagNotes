<script lang="ts">
  import type { Note } from '$lib/types';
  import { page } from '$app/stores';
  import { notesStore } from '$lib/stores/notes.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  const { getNote, updateNote, createNote, deleteNote, tags } = notesStore;

  let note = $state<Note | null>(null);
  const noteId = $page.params.id;
  const isNew = noteId === 'new';
</script>

<div class="container mx-auto p-4 max-w-4xl">
  <div class="flex justify-between items-center mb-6">
    <Button variant="ghost" onclick={() => goto("/")} class="gap-2">
      <ArrowLeft className="h-4 w-4" />
      Back
      </Button>  
  </div>
</div>