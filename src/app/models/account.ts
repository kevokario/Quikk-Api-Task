import {Transaction} from "./transaction";

export interface Account {
  id?:number,
  userId?:number,
  amount:number,
  transactions?:Array<Transaction>
}
