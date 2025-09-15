import { DefaultError } from "./typing";

export class Result<SuccessType, ErrorType extends DefaultError = DefaultError> {
  private constructor(
    private readonly success?: SuccessType,
    private readonly error?: ErrorType,
  ) {
    this.success = success;
    this.error = error;
  }

  get value() {
    return this.success;
  }

  get errorType(): Pick<ErrorType, "type">["type"] | undefined {
    return this.errorValue?.type;
  }

  get errorValue() {
    return this.error;
  }

  get hasValue() {
    return this.success !== undefined;
  }

  get hasError() {
    return this.error !== undefined;
  }

  static fail<T extends DefaultError = DefaultError>(error: T) {
    return new Result<undefined, T>(undefined, {
      ...error,
      type: error?.type ?? "UNKNOWN",
    });
  }

  static success<T>(success: T) {
    return new Result<T, undefined>(success, undefined);
  }
}
