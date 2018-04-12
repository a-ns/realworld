import { Resolver } from '../types/ResolverType'
export function RequiresAuth<T extends Resolver>(
  resolver: T
): Resolver;
export function RequiresAuth<T extends Resolver>(resolver: T) {
  return (parent: any, args: any, context: any, info: any) => {
    if (!context.username) {
      return { errors: { body: ["not authenticated"] } };
    }
    return resolver(parent, args, context, info);
  };
}
