export interface Transaction {
  id:number,
  accountId:number,
  time:string,
  action:string,
  otherParty:string,
  amount:number,
  beforeAmount:number,
  otherAmount:number
}
