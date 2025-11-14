export class InternalEvent<T> {
  constructor(protected readonly eventData: T) {}

  get data(): T {
    return this.eventData;
  }
}
