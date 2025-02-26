export class Notification {
  constructor(
    public id: string,
    public message: string,
    public created_at: string,
    public data: any,
    public type: number,
  ) {}
}
