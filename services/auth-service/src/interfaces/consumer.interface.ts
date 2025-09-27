export interface consumerEventOption {
  queue: string;
  handler: (data: any) => Promise<void>;
}
