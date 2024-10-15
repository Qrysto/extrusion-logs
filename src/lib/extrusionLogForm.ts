import { z } from 'zod';

export const formSchema = z.object({
  // employeeId: z.string().nullable(),
  date: z.date().nullable(),
  // shift: z.enum(['DAY', 'NIGHT']).nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),

  // item: z.string().nullable(),
  // customer: z.string().nullable(),
  dieCode: z.string().nullable(),
  subNumber: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .int('Has to be integer')
    .nullable(),
  // cavity: z.coerce.number().min(0).int().nullable(),
  // productKgpm: z.coerce.number().min(0).nullable(),
  billetType: z.string().nullable(),
  lotNumberCode: z.string().nullable(),
  ingotRatio: z.coerce.number().min(0).nullable(),
  // billetKgpm: z.coerce.number().min(0).nullable(),
  billetLength: z.coerce.number().min(0).nullable(),
  billetQuantity: z.coerce.number().int().min(0).nullable(),
  // billetWeight: z.coerce.number().min(0).nullable(),
  orderLength: z.coerce.number().min(0).nullable(),
  ramSpeed: z.coerce.number().min(0).nullable(),
  billetTemp: z.coerce.number().min(0).nullable(),
  outputTemp: z.coerce.number().min(0).nullable(),

  result: z.enum(['OK', 'NG']).nullable(),
  // outputYield: z.coerce.number().min(0).nullable(),
  productionQuantity: z.coerce.number().min(0).int().nullable(),
  // productionWeight: z.coerce.number().min(0).nullable(),
  remark: z.string().nullable(),
  // outputRate: z.coerce.number().min(0).nullable(),
  ngQuantity: z.coerce.number().min(0).int().nullable(),
  // ngWeight: z.coerce.number().min(0).nullable(),
  // ngPercentage: z.coerce.number().min(0).nullable(),
  // code: z.string().nullable(),
  buttLength: z.coerce.number().min(0).nullable(),
  dieTemp: z.coerce.number().min(0).nullable(),
  containerTemp: z.coerce.number().min(0).nullable(),
  pressure: z.coerce.number().min(0).nullable(),
  pullerMode: z.coerce.number().int().min(0).nullable(),
  pullerSpeed: z.coerce.number().min(0).nullable(),
  pullerForce: z.coerce.number().min(0).nullable(),
  extrusionCycle: z.coerce.number().int().min(0).nullable(),
  extrusionLength: z.coerce.number().min(0).nullable(),
  segments: z.coerce.number().int().min(0).nullable(),
  coolingMethod: z.string().nullable(),
  coolingMode: z.coerce.number().int().min(0).nullable(),
  startButt: z.coerce.number().min(0).nullable(),
  endButt: z.coerce.number().min(0).nullable(),
});

export type FullFormValues = z.infer<typeof formSchema>;
