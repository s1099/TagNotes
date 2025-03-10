<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="w-screen h-screen bg-white/85 dark:bg-black/85">
{@render children()}

</main>