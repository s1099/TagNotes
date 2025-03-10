import { writable, derived, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Note } from '$lib/types';

interface NotesStore {
  subscribe: Writable<Note[]>['subscribe'];
  tags: Writable<string[]>;
  getNote: (id: string) => Note | null;
  createNote: (input: { title: string; content: string; tags: string[] }) => Note;
  updateNote: (updatedNote: Partial<Note> & { id: string }) => Note;
  deleteNote: (id: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  getNoteIds: () => string[];
}

function createNotesStore(): NotesStore {
  const notesStore = writable<Note[]>([]);
  const tagsStore = writable<string[]>([]);

  if (typeof window !== 'undefined') {
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
      console.error('Error loading from localStorage:', error);
    }
  }

  function getNote(id: string): Note | null {
    const notes = get(notesStore);
    return notes.find((note) => note.id === id) || null;
  }

  function createNote(input: { title: string; content: string; tags: string[] }): Note {
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

  function updateNote(updatedNote: Partial<Note> & { id: string }): Note {
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

  function deleteNote(id: string): void {
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
    tagsStore.update((tags) => tags.filter((tag) => tag !== tagToRemove));
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

  function getNoteIds(): string[] {
    const notes = get(notesStore);
    return notes.map((note) => note.id);
  }

  return {
    subscribe: notesStore.subscribe,
    tags: tagsStore,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    addTag,
    removeTag,
    getNoteIds
  };
}

export const notesStore = createNotesStore();
