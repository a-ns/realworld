import { Resolver } from "../types/ResolverType";

export const RequiresAuth = (resolver: Resolver) => (parent: any, args: any, context: any, info: any) => {
    if(!context.user) {
        return "not authenticated"
    }
    return resolver(parent, args, context, info)
}
