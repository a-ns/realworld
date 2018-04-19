export class BaseController {
    toBase64(value: any){
      value = typeof value === 'object' ? JSON.stringify(value) : value
      const rv = Buffer.from(value).toString("base64")
      return rv
    }
    
  fromBase64(value: string) {
    return JSON.parse(Buffer.from(value, 'base64').toString())
  }

  paginate(cursorable: any[], args: any) {
    if(cursorable.length === 0) {
      return {
        edges: [],
        count: 0,
        pageInfo: {
          hasNextPage: false,
          endCursor: ""
        }
      }
    }
    console.log('paginating', args)
    const edges = cursorable.map((item: any) => ({node: item, cursor: this.toBase64(item)}))
    console.log(edges)
    const count = edges.length
    const pageInfo = {
      hasNextPage: cursorable.length > edges.length,
      endCursor: edges[edges.length - 1].cursor
    }
    return {
      edges,
      count,
      pageInfo
    }
  }
}