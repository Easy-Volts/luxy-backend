export interface ApiResponses<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export class ApiResponseBuilder<T> {
  private success: boolean;
  private message?: string;
  private data?: T;

  constructor() {
    this.success = true;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  setData(data: T): this {
    this.data = data;
    return this;
  }

  setError(message: string): this {
    this.success = false;
    this.message = message;
    return this;
  }

  build(): ApiResponses<T> {
    return {
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
