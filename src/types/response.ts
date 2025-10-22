export type ResponseData<T = Record<string, unknown>> = {
  status: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    extra?: Record<string, unknown>;
  };
};
