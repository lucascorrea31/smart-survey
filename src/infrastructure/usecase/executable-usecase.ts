export interface ExecutableUsecase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
