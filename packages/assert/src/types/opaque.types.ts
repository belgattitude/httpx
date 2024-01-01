declare const tag: unique symbol;

export type WeakOpaqueContainer<Token> = {
  readonly [tag]: Token;
};
