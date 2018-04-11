export class BaseController {
    toBase64(value: any){
        return Buffer.from(value.toString()).toString("base64")
    }
    
  fromBase64(value: string) {
    return Buffer.from(value, 'base64').toString()
  }

  paginate(cursorable: any, {first, after}: {first: number, after: string}) {
    let items = cursorable.sort((a: any, b: any) => a.createdAt < b.createdAt ? -1 : 1)
    const index = items.findIndex((element: any) => this.toBase64(element) === after)
    items = items.slice(0, index).reverse().slice(0, first)
    const edges = items.map((item: any) => ({node: item, cursor: this.toBase64(item)}))
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