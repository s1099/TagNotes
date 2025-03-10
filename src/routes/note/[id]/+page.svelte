<script lang="ts">
  import type { Note } from "$lib/types";
  import { page } from "$app/stores";
  import { notesStore } from "$lib/stores/notes.svelte";
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, Save, Trash } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { onMount } from "svelte";

  const { getNote, updateNote, createNote, deleteNote, tags } = notesStore;

  let note = $state<Note | null>(null);
  const noteId = $page.params.id;
  const isNew = noteId === "new";
  let title = $state("");
  let content = $state("");
  let loaded = $state(false);

  onMount(() => {
    if (!isNew) {
      note = getNote(noteId);
      if (note) {
        title = note.title || "";
        content = note.content || "";
      }
    }
    loaded = true;
  });

  function saveNote() {
    if (isNew) {
      createNote({
        title,
        content,
        tags: ["xyz"],
      });
    } else if (note) {
      updateNote({
        id: noteId,
        title,
        content,
      });
    }
    goto("/");
  }

  function onDelete() {
    if (!isNew) deleteNote(noteId);
    goto("/");
  }
  function onBack() {
    saveNote();
    goto("/");
  }
</script>

<div class="w-full px-8 py-6">
  <div class="flex justify-between items-center mb-6">
    <Button variant="ghost" onclick={onBack} class="gap-2 z-10">
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
    <div class="flex items-center gap-2">
      {#if !isNew}
        <!-- TODO: Confirmation popup -->
        <Button variant="outline" onclick={onDelete} size="icon" class="z-10">
          <Trash class="h-4 w-4" />
        </Button>
      {/if}
    </div>
  </div>
  <div class="space-y-4">
    <Input
      type="text"
      placeholder="Title"
      bind:value={title}
      class="font-bold border-none px-2 h-auto bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
      style="font-size: 2rem;"
    />
    <!-- TODO: make it expand by itself -->
    <textarea
      bind:value={content}
      class="w-full h-[40rem] p-3 rounded-md bg-transparent border focus:outline-none resize-none"
      placeholder="Note"
      style="font-size: 1.25rem;"
    ></textarea>
  </div>
</div>
