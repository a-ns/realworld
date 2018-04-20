export class BaseController {
  toBase64(value: any) {
    value = typeof value === "object" ? JSON.stringify(value) : value;
    const rv = Buffer.from(value).toString("base64");
    return rv;
  }

  fromBase64(value: string) {
    if (!value) {
      return null;
    }
    return JSON.parse(Buffer.from(value, "base64").toString());
  }

  paginate(cursorable: any[], args: any) {
    if (cursorable.length === 0) {
      return {
        edges: [],
        count: 0,
        pageInfo: {
          hasNextPage: false,
          endCursor: ""
        }
      };
    }
    const edges = cursorable.map((item: any) => ({
      node: item,
      cursor: this.toBase64(item)
    }));
    const count = edges.length;
    const pageInfo = {
      hasNextPage: args.hasNextPage,
      endCursor: edges[edges.length - 1].cursor
    };
    return {
      edges,
      count,
      pageInfo
    };
  }
}
