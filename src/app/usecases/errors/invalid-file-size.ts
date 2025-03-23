export class InvalidaFileSize extends Error {
  constructor() {
    super('File size limit reached')
  }
}
