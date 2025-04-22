<script lang="ts">
  import "../app.css";
  import ViewTransition from "$lib/components/navgation.svelte";
  let { children } = $props();
</script>

<main class="w-screen h-screen bg-white/85 dark:bg-black/80">
  <ViewTransition />
  <div
    data-tauri-drag-region
    class="absolute w-screen h-16 z-10"
    id="drag-region"
  ></div>
  {@render children()}
</main>
