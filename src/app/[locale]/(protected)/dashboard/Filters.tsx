'use client';

import { Input } from '@/components/ui/input';
import { useUpdateSearchParams } from '@/lib/client';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useTranslate } from '@/lib/intl/client';
import { Combobox } from '@/components/ui/combobox';
import { useSuggestionData, useAccount } from '@/lib/client';
import { formatDateRange, parseDateRange } from '@/lib/dateTime';

export default function Filters() {
  const __ = useTranslate();
  const account = useAccount();
  const isAdmin = account.role !== 'team';
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const { data } = useSuggestionData();
  const {
    plantList,
    machineList,
    // itemList,
    // customerList,
    dieCodeList,
    lotNoList,
  } = data || {};

  return (
    <>
      <DateRangePicker
        dateRange={
          searchParams.get('date')
            ? parseDateRange(searchParams.get('date'))
            : null
        }
        onDateRangeChange={(value) =>
          updateSearchParams('date', formatDateRange(value))
        }
      />

      {/* <Select
        value={searchParams.get('shift') || ''}
        onValueChange={(value) =>
          updateSearchParams(
            'shift',
            ['DAY', 'NIGHT'].includes(value) ? value : ''
          )
        }
      >
        <SelectTrigger className="w-24">
          <SelectValue
            placeholder={<span className="opacity-50">{__('Shift')}</span>}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">{__('Day')}</SelectItem>
          <SelectItem value="night">{__('Night')}</SelectItem>
          <SelectItem value="both">{__('Both')}</SelectItem>
        </SelectContent>
      </Select> */}

      {isAdmin && (
        <>
          <Combobox
            placeholder={__('Select plant')}
            value={searchParams.get('plant')}
            onValueChange={(value) => updateSearchParams('plant', value)}
            list={plantList}
          />

          <Combobox
            placeholder={__('Select machine')}
            value={searchParams.get('machine')}
            onValueChange={(value) => updateSearchParams('machine', value)}
            list={machineList}
          />
        </>
      )}

      {/* <Combobox
        placeholder={__('Select item')}
        value={searchParams.get('item')}
        onValueChange={(value) => updateSearchParams('item', value)}
        list={itemList}
      />

      <Combobox
        placeholder={__('Select customer')}
        value={searchParams.get('customer')}
        onValueChange={(value) => updateSearchParams('customer', value)}
        list={customerList}
      /> */}

      <Combobox
        placeholder={__('Select die code')}
        value={searchParams.get('dieCode')}
        onValueChange={(value) => updateSearchParams('dieCode', value)}
        list={dieCodeList}
      />

      {/* <Input
        type="number"
        name="cavity"
        min={0}
        step={1}
        placeholder={__('Cavity')}
        value={searchParams.get('cavity') || ''}
        onChange={(evt) =>
          updateSearchParams('cavity', evt.target.value || undefined)
        }
        className="w-24"
      /> */}

      <Combobox
        placeholder={__('Select lot number')}
        value={searchParams.get('lotNo')}
        onValueChange={(value) => updateSearchParams('lotNo', value)}
        list={lotNoList}
      />

      <Select
        value={searchParams.get('result') || ''}
        onValueChange={(value) =>
          updateSearchParams(
            'result',
            ['OK', 'NG'].includes(value) ? value : ''
          )
        }
      >
        <SelectTrigger className="w-24">
          <SelectValue
            placeholder={<span className="opacity-50">OK/NG</span>}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OK">OK</SelectItem>
          <SelectItem value="NG">NG</SelectItem>
          <SelectItem value="both">{__('Both')}</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={__('Remark')}
        name="remark"
        value={searchParams.get('remarkSearch') || ''}
        onChange={(evt) =>
          updateSearchParams('remarkSearch', evt.target.value || undefined)
        }
        className="w-40"
      />

      <Select
        value={searchParams.get('deleted') || ''}
        onValueChange={(value) =>
          updateSearchParams(
            'deleted',
            ['true', 'both'].includes(value) ? value : ''
          )
        }
      >
        <SelectTrigger className="w-28">
          <SelectValue
            placeholder={<span className="opacity-50">{__('Deleted?')}</span>}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">{__('Deleted')}</SelectItem>
          <SelectItem value="false">{__('Not deleted')}</SelectItem>
          <SelectItem value="both">{__('Both')}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
