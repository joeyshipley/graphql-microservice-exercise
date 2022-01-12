import { createParamDecorator, MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { AuthPayload } from '../types';
import { AuthenticationError } from 'apollo-server-express';

// NOTE: custom authorize middleware as TypeGrahQL does not currently support their built-in Authorization decorators with Subgraphs, only standard Graphs.
export class Authorize implements MiddlewareInterface<any> {
  constructor() {}

  async use({ context }: ResolverData<any>, next: NextFn) {
    const authPayload: AuthPayload | null | undefined = context.authPayload;
    if(!authPayload || !authPayload.userId) {
      throw new AuthenticationError('Not logged in.');
    }
    return next();
  }
}

export function AuthPayloadContext() {
  return createParamDecorator<any>(({ context }) => {
    return context.authPayload;
  });
}