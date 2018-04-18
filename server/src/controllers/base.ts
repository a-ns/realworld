export class BaseController {
    toBase64(value: any){
        return Buffer.from(value.toString()).toString("base64")
    }
    
  fromBase64(value: string) {
    return Buffer.from(value, 'base64').toString()
  }

  paginate(cursorable: any, args: any) {
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