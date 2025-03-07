<script>
  import { Calendar } from 'lucide-svelte';
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { formatDate } from '$lib/utils';

  export let note;
</script>

<a href={`/note/${note.id}`} class="block">
  <Card
    class="h-[220px] overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
  >
    <CardHeader class="pb-2">
      <CardTitle class="line-clamp-2 pb-2">{note.title || 'Untitled Note'}</CardTitle>
      <div class="flex items-center text-xs text-muted-foreground">
        <Calendar class="h-3 w-3 mr-1" />
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </CardHeader>
    <CardContent class="relative pt-2">
      <div
        class="text-sm text-muted-foreground line-clamp-6 hover:after:opacity-0 group-hover:after:opacity-0"
      >
        {note.content || 'No content'}
      </div>
    </CardContent>

    {#if note.tags.length > 0}
      <CardFooter class="flex flex-wrap gap-1 pt-0">
        {#each note.tags as tag}
          <Badge variant="secondary" class="text-xs">
            {tag}
          </Badge>
        {/each}
      </CardFooter>
    {/if}
  </Card>
</a>
