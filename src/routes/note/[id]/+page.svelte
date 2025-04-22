<script lang="ts">
  import type { Note } from "$lib/types";
  import { page } from "$app/state";
  import { notesStore } from "$lib/stores/notes.svelte";
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, Trash } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { Input } from "$lib/components/ui/input";
  import { onMount } from "svelte";

  const { getNote, updateNote, createNote, deleteNote, tags } = notesStore;

  let note = $state<Note | null>(null);
  const noteId = page.params.id;
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

<div class="relative w-full h-screen overflow-hidden">
  <div class="absolute top-0 left-0 right-0 p-6">
    <div class="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        onclick={onBack}
        class="gap-2 z-10 cursor-pointer"
      >
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
  </div>

  <div class="absolute top-24 bottom-0 left-0 right-0 p-8 pt-0">
    <div class="space-y-4">
      <Input
        type="text"
        placeholder="Title"
        bind:value={title}
        class="font-bold border-none px-2 h-auto bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
        style="font-size: 2rem;"
      />
    </div>
    <!-- TODO: make the page expand instead of the textbox -->
    <textarea
      bind:value={content}
      class="w-full h-[calc(100vh-12rem)] p-3 rounded-md bg-transparent focus:outline-none resize-none overflow-y-auto"
      placeholder="..."
      style="font-size: 1.25rem;"
    ></textarea>
  </div>
</div>
