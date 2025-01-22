/**
 * Error with additional information about the request that casued it
 * Used for backend response error handling
 */
export class ApiError extends Error {
  /** HTTP status code of the error */
  public status?: number;
  /** Namespace of the requested resource */
  public namespace?: string;
  /** Cluster name */
  public cluster?: string;

  constructor(
    public message: string,
    props?: { status?: number; namespace?: string; cluster?: string }
  ) {
    super(message);
    this.status = props?.status;
    this.namespace = props?.namespace;
    this.cluster = props?.cluster;
  }
}
