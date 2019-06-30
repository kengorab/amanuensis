declare interface NoteMetadata {
  id: string,
  name: string,
  createdTimestamp: number,
  updatedTimestamp: number,
}

declare interface Note {
  summary: NoteSummary,
  contents: string
}