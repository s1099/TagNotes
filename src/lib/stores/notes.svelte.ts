import { writable, derived, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Note } from '$lib/types';

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface NotesStore {
  subscribe: Writable<Note[]>['subscribe'];
  tags: Writable<string[]>;
  getNote: (id: string) => Note | null;
  createNote: (input: { title: string; content: string; tags: string[] }) => Promise<Note>;
  updateNote: (updatedNote: Partial<Note> & { id: string }) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

function createNotesStore(): NotesStore {
  // Create the writable stores
  const notesStore = writable<Note[]>([]);
  const tagsStore = writable<string[]>([]);
  const isLoaded = writable(false);

  // Load initial data
  try {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      notesStore.set(JSON.parse(storedNotes));
    }

    const storedTags = localStorage.getItem('tags');
    if (storedTags) {
      tagsStore.set(JSON.parse(storedTags));
    }
  } catch (error) {
    console.error('Error loading from localstore:', error);
  } finally {
    isLoaded.set(true);
  }

  // Create debounced save functions
  const saveNotes = debounce((updatedNotes: Note[]) => {
    try {
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  }, 500);

  const saveTags = debounce((updatedTags: string[]) => {
    try {
      localStorage.setItem('tags', JSON.stringify(updatedTags));
    } catch (error) {
      console.error('Error saving tags to localStorage:', error);
    }
  }, 500);

  // Subscribe to notes changes to auto-save
  const unsubscribeNotes = notesStore.subscribe((notes) => {
    if (get(isLoaded)) {
      saveNotes(notes);

      // Update tags
      const allTags = Array.from(new Set(notes.flatMap((note) => note.tags))).sort();
      const currentTags = get(tagsStore);
      if (JSON.stringify(allTags) !== JSON.stringify(currentTags)) {
        tagsStore.set(allTags);
        saveTags(allTags);
      }
    }
  });

  // Store methods
  function getNote(id: string): Note | null {
    const notes = get(notesStore);
    return notes.find((note) => note.id === id) || null;
  }

  async function createNote(input: {
    title: string;
    content: string;
    tags: string[];
  }): Promise<Note> {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now
    };

    notesStore.update((notes) => [newNote, ...notes]);
    return newNote;
  }

  async function updateNote(updatedNote: Partial<Note> & { id: string }): Promise<Note> {
    const now = new Date().toISOString();
    const currentNotes = get(notesStore);
    const existingNote = currentNotes.find((note) => note.id === updatedNote.id);

    if (!existingNote) {
      throw new Error(`Note with ID ${updatedNote.id} not found`);
    }

    const updated = {
      ...existingNote,
      ...updatedNote,
      updatedAt: now
    };

    notesStore.update((notes) =>
      notes.map((note) => (note.id === updatedNote.id ? updated : note))
    );

    return updated;
  }

  async function deleteNote(id: string): Promise<void> {
    notesStore.update((notes) => notes.filter((note) => note.id !== id));
  }

  function addTag(tag: string): void {
    tagsStore.update((tags) => {
      if (!tags.includes(tag)) {
        return [...tags, tag].sort();
      }
      return tags;
    });
  }

  function removeTag(tagToRemove: string): void {
    // Remove tag from the tags list
    tagsStore.update((tags) => tags.filter((tag) => tag !== tagToRemove));

    // Also remove this tag from all notes that have it
    notesStore.update((notes) => {
      const updatedNotes = notes.map((note) => {
        if (note.tags.includes(tagToRemove)) {
          return {
            ...note,
            tags: note.tags.filter((tag) => tag !== tagToRemove),
            updatedAt: new Date().toISOString()
          };
        }
        return note;
      });

      return updatedNotes;
    });
  }

  // Return the store interface
  return {
    subscribe: notesStore.subscribe,
    tags: tagsStore,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    addTag,
    removeTag
  };
}

export const notesStore = createNotesStore();
