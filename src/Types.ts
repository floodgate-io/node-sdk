export type KeyValue<T, U> = {
  key: T,
  value: U,
};

export type User = {
  id: string,
  email: string,
  custom: { [key: string] : string; };
}