export type DefaultError<T extends string = string | "UNKNOWN"> = {
  type?: T;
  source: string;
  message: string;
  details?: unknown;
};
