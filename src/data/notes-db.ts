import * as electron from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'

const access = promisify(fs.access)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

const app = electron.app || electron.remote.app
const userDataPath = app.getPath('userData')

const notesMetadataPath = path.join(userDataPath, 'notes-meta.json')
const noteContentsDirPath = path.join(userDataPath, 'notes');

// Notes is initialized lazily
let notes: NoteMetadata[] | null = null
async function lazyInitNotes() {
  if (notes !== null) return notes

  try {
    await access(notesMetadataPath)
    const file = await readFile(notesMetadataPath, { encoding: 'utf-8' })
    const json = JSON.parse(file)
    notes = json.notes as NoteMetadata[]
  } catch {
    notes = []
    await writeNotes(notes)
  }
}

async function writeNotes(notes: NoteMetadata[]) {
  await writeFile(notesMetadataPath, JSON.stringify({ notes }), { encoding: 'utf-8' })
}

export async function getNotesMetadata(): Promise<NoteMetadata[]> {
  await lazyInitNotes()
  return notes!
}

export async function saveNoteMetadata(name: string): Promise<NoteMetadata> {
  const id = Math.random().toString(32).substring(2)
  const timestamp = Date.now()
  const note = {
    id,
    name,
    createdTimestamp: timestamp,
    updatedTimestamp: timestamp
  }

  await lazyInitNotes()
  notes = notes!.concat(note)
  await writeNotes(notes)
  return note
}

export async function getNoteContents(noteId: string): Promise<string | null> {
  const notePath = path.join(noteContentsDirPath, `${noteId}.md`)
  try {
    await access(notePath)
    return readFile(notePath, { encoding: 'utf-8' })
  } catch {
    return null
  }
}

export async function saveNoteContents(noteId: string, noteContents: String) {
  try {
    await access(noteContentsDirPath)
  } catch {
    await mkdir(noteContentsDirPath)
  }

  const notePath = path.join(noteContentsDirPath, `${noteId}.md`)
  await writeFile(notePath, noteContents, { encoding: 'utf-8' })
}
