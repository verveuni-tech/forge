import type { VercelRequest, VercelResponse } from "@vercel/node";

export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void;

export function withErrorHandling(handler: Handler): Handler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      const status = err instanceof HttpError ? err.statusCode : 500;
      const message = err instanceof Error ? err.message : "Internal server error";
      if (status >= 500) console.error(err);
      res.status(status).json({ error: message });
    }
  };
}

export function methodGuard(req: VercelRequest, res: VercelResponse, allowed: string[]): boolean {
  if (!req.method || !allowed.includes(req.method)) {
    res.setHeader("Allow", allowed.join(", "));
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return false;
  }
  return true;
}
