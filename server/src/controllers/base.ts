export class BaseController {
    toBase64(value: any){
        return Buffer.from(value.toString()).toString("base64")
    }
    
  fromBase64(value: string) {
    return Buffer.from(value, 'base64').toString()
  }

  paginate(cursorable: any, args: any) {
    console.log(args)
    const edges = cursorable.map((item: any) => ({node: item, cursor: this.toBase64(item)}))
    const count = edges.length
    const pageInfo = {
      hasNextPage: cursorable.length > edges.length,
      endCursor: edges[edges.length].cursor
    }
    return {
      edges,
      count,
      pageInfo
    }
  }
}