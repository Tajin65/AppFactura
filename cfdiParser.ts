
export type QuoteItem = {

  id:string

  catalog:string
  description:string

  quantity:number

  price:number
  cost:number

}

export type Quote = {

  id:string
  folio:string

  clientId:number
  seller:string

  currency:"MXN" | "USD"
  exchangeRate:number

  items:QuoteItem[]

}
