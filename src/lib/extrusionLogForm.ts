import { z } from 'zod';
import { getTranslate } from '@/lib/intl/client';

export const formSchema = z
  .object({
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
  })
  .refine(
    ({ startTime, endTime }) => {
      console.log('validate', startTime, endTime);

      if (!startTime || !endTime) return true;
      const startMinutes = toMinutes(startTime);
      const endMinutes = toMinutes(endTime);
      console.log(startMinutes, endMinutes);
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

function toMinutes(time: string) {
  const hours = parseInt(time.substring(0, 2)) || 0;
  const minutes = parseInt(time.substring(3)) || 0;
  return hours * 60 + minutes;
}

export type FullFormValues = z.infer<typeof formSchema>;
