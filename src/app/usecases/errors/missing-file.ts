export class MissingFile extends Error {
  constructor() {
    super('File is required')
  }
}
