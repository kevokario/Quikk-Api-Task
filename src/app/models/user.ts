import {Account} from "./account";

export interface User {
  id?:number,
  name:string,
  phone:string,
  email:string,
  password?:string
  accounts?:Array<Account>
}
