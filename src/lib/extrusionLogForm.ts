import { z } from 'zod';
import { getTranslate } from '@/lib/intl/client';
import { toMinutes } from './utils';

export const formBaseSchema = z.object({
  // employeeId: z.string(),
  date: z.string(),
  // shift: z.enum(['DAY', 'NIGHT']),
  startTime: z.string(),
  endTime: z.string(),

  // item: z.string(),
  // customer: z.string(),
  dieCode: z.string().length(10),
  subNumber: z.coerce
    .number()
    .min(0, 'Cannot be negative')
    .int('Has to be integer'),
  // cavity: z.coerce.number().min(0).int(),
  // productKgpm: z.coerce.number().min(0),
  billetType: z.string(),
  lotNumberCode: z.string(),
  ingotRatio: z.coerce.number().min(0),
  // billetKgpm: z.coerce.number().min(0),
  billetLength: z.coerce.number().min(0),
  billetQuantity: z.coerce.number().int().min(0),
  // billetWeight: z.coerce.number().min(0),
  orderLength: z.coerce.number().min(0),
  ramSpeed: z.coerce.number().min(0),
  billetTemp: z.coerce.number().min(0),
  outputTemp: z.coerce.number().min(0),

  result: z.enum(['OK', 'NG']),
  // outputYield: z.coerce.number().min(0),
  productionQuantity: z.coerce.number().min(0).int(),
  // productionWeight: z.coerce.number().min(0),
  remark: z.string().nullable().default(null),
  // outputRate: z.coerce.number().min(0),
  ngQuantity: z.coerce.number().min(0).int(),
  // ngWeight: z.coerce.number().min(0),
  // ngPercentage: z.coerce.number().min(0),
  // code: z.string(),
  buttLength: z.coerce.number().min(0),
  dieTemp: z.coerce.number().min(0),
  containerTemp: z.coerce.number().min(0),
  pressure: z.coerce.number().min(0),
  pullerMode: z.coerce.number().int().min(0),
  pullerSpeed: z.coerce.number().min(0),
  pullerForce: z.coerce.number().min(0),
  extrusionCycle: z.coerce.number().int().min(0),
  extrusionLength: z.coerce.number().min(0),
  segments: z.coerce.number().int().min(0),
  coolingMethod: z.string(),
  coolingMode: z.coerce.number().int().min(0),
  startButt: z.coerce.number().min(0),
  endButt: z.coerce.number().min(0),
  beforeSewing: z.coerce.number().min(0),
  afterSewing: z.coerce.number().min(0),
});

export const formSchema = formBaseSchema.refine(
  ({ startTime, endTime }) => {
    if (!startTime || !endTime) return true;
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);
    if (endMinutes > startMinutes) return true;
    return endMinutes < 420; // 420 minutes == 7:00 am
  },
  () => {
    const __ = getTranslate();
    console.log('get Error');

    return {
      message: __('End time must not exceed 7:00 am of the following day'),
      path: ['endTime'],
    };
  }
);

export type FullFormValues = z.infer<typeof formSchema>;
