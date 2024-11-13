// errors.ts
export class FileNotFoundError extends Error {
  constructor(fileName: string) {
    super(`File not found: ${fileName}`);
    this.name = 'FileNotFoundError';
  }
}

export class DependencyError extends Error {
  constructor(dependencyName: string) {
    super(`Dependency not met: ${dependencyName}`);
    this.name = 'DependencyError';
  }
}

export class AIQueryError extends Error {
  constructor(message: string) {
    super(`AI query failed: ${message}`);
    this.name = 'AIQueryError';
  }
}
