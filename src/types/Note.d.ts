declare interface NoteMetadata {
  id: string,
  name: string,
  tags: string[],
  createdTimestamp: number,
  updatedTimestamp: number,
}

declare interface Note {
  summary: NoteSummary,
  contents: string
}