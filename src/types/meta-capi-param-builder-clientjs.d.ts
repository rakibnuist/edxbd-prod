declare module 'meta-capi-param-builder-clientjs' {
  export interface ClientParamBuilderResult {
    _fbc?: string;
    _fbp?: string;
    _fbi?: string;
  }

  export interface ClientParamBuilderApi {
    processAndCollectAllParams(
      url?: string | null,
      getIpFn?: () => Promise<string> | string,
    ): Promise<ClientParamBuilderResult>;
    getFbc(): string | null | undefined;
    getFbp(): string | null | undefined;
    getClientIpAddress(): string | null | undefined;
    getNormalizedAndHashedPII(
      value: string,
      dataType: string,
    ): string | null | undefined;
  }

  const clientParamBuilder: ClientParamBuilderApi & {
    default?: ClientParamBuilderApi;
  };
  export = clientParamBuilder;
}
