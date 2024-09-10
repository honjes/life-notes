import { INoteBasic } from "@/types"
import { NotFoundError, NotFoundErrors } from "@/utils"
import { isAfter } from "date-fns"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useNoteStore = defineStore("note", () => {
  const db = new PouchDB<INoteBasic>("notes")
  // create indexes
  db.createIndex({ index: { fields: ["key"] } })

  const updates = ref(0)
  const noteUpdate = ref<string[]>([])

  /**
   * returns all notes
   * @returns {Promise<INoteBasic[]>}
   */
  async function getNotes(): Promise<INoteBasic[]> {
    return (
      (await db.allDocs({ include_docs: true, descending: true })).rows
        .map(row => row.doc as INoteBasic)
        // @ts-expect-error - ignore rows that include language (probably the index reference of the db)
        .filter(s => s.language !== "query")
    )
  }

  /**
   * returns a note by key
   * @param {string} key - note key
   * @returns {Promise<INoteBasic>}
   */
  async function getNote(key: string): Promise<INoteBasic> {
    try {
      return await db.get(`note-${key}`)
    } catch (err: unknown) {
      // @ts-expect-error - check if err is a PouchDB error
      if (err.name === "not_found" && err.status === 404) {
        throw new NotFoundError(NotFoundErrors.NoteNotFound)
      }
      console.error("get note error: ", err)
      throw err
    }
  }

  /**
   * add a note to the database
   * @param {INoteBasic} note - note to add
   */
  async function addNote(note: INoteBasic) {
    try {
      await db.put(note)
      // update store
      updates.value++
      noteUpdate.value = [note.key]
    } catch (err) {
      console.error("add note error: ", err)
      throw err
    }
  }

  /**
   * Adds a note occurrence
   * @param {string} key - key of the note
   * @TODO check if there the current time is realy the last entry
   */
  async function addOccurrence(key: string, newTime: string) {
    try {
      const note = await db.get(`note-${key}`)
      const newNote = { ...note }
      newNote.occurrences++
      if (isAfter(new Date(newTime), new Date(newNote.lastEntry))) {
        newNote.lastEntry = newTime
      }

      await db.upsert(`note-${note.key}`, () => newNote)
      // update store
      updates.value++
      noteUpdate.value = [note.key]
    } catch (err) {
      console.error("add note occurrence error: ", err)
      throw err
    }
  }

  /**
   * Removes a note occurrence
   * @params {string} key - note key
   * @TODO check for the last occurrence
   */
  async function removeOccurrence(key: string) {
    try {
      const note = await db.get(`note-${key}`)
      if (note.occurrences > 1) {
        await db.upsert(`note-${key}`, () => ({ ...note, occurrences: note.occurrences - 1 }))
      } else {
        await db.remove(note)
      }
      // update store
      updates.value++
      noteUpdate.value = [key]
    } catch (err) {
      console.error("remove note occurrence error: ", err)
      throw err
    }
  }

  return { updates, noteUpdate, getNotes, getNote, addNote, addOccurrence, removeOccurrence }
})
