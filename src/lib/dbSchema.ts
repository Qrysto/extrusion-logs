// DB Schema 0.0.1

import { Generated } from 'kysely';

export interface Database {
  account: AccountTable;
  employee: EmployeeTable;
  extrusion: ExtrusionTable;
}

export interface AccountTable {
  username: string;
  password: string;
  role: 'admin' | 'team';
}

export interface EmployeeTable {
  id: string;
  fullName: string;
}

export interface ExtrusionTable {
  id: Generated<number>;
  extrusionTeam: string;
  date: Date;
  workingShift: 'morning' | 'afternoon' | 'night';
  employeeId: string;
  moldCode: string;
  productCode: string;
  client: string;
  productCategoryCode: string;
  billetType: string;
  billetLotNo: string;
  ramSpeed: number;
  pressure: number;
  successRate: number;
}

// export interface ProductCategoryTable {
//   code: string;
//   productCategory: string;
// }
