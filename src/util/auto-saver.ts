export default class AutoSaver<T> {
  private isUnsavedChanges: boolean
  private lastUpdateTimestamp: number
  private autoSaveHandle: number | null = null

  constructor(private callback: (contents: T) => void, public contents: T) {
    this.isUnsavedChanges = false
    this.lastUpdateTimestamp = 0
  }

  private loop() {
    if (this.isUnsavedChanges && Date.now() - this.lastUpdateTimestamp > 2000) {
      this.isUnsavedChanges = false
      this.callback(this.contents)
    }
  }

  start() {
    this.autoSaveHandle = setInterval(this.loop.bind(this), 2000)
  }

  update(contents: T) {
    this.contents = contents
    this.lastUpdateTimestamp = Date.now()
    this.isUnsavedChanges = true
  }

  dispose() {
    this.autoSaveHandle !== null && clearInterval(this.autoSaveHandle)
  }
}
