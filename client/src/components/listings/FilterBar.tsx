import { FilterValues } from '../../types';
import { Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface FilterBarProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

const defaultFilters: FilterValues = {
  search: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', availableBy: '', sort: 'newest',
};

const BEDS = [
  { label: 'Any Beds', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
];

const BATHS = [
  { label: 'Any Baths', value: '' },
  { label: '1+', value: '1' },
  { label: '1.5+', value: '1.5' },
  { label: '2+', value: '2' },
  { label: '2.5+', value: '2.5' },
];

const SORT = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
];

export default function FilterBar({ values, onChange }: FilterBarProps) {
  const update = (key: keyof FilterValues, value: string) => onChange({ ...values, [key]: value });
  const hasActive = Object.entries(values).some(([k, v]) => k !== 'sort' && v !== '');

  const inputCls = 'w-full px-3 py-2 bg-white border border-line rounded-lg text-ink text-sm outline-none focus:ring-2 focus:ring-brand/20 transition-colors placeholder:text-faint';
  const labelCls = 'block text-xs text-muted mb-1.5';

  return (
    <div className="bg-white border border-line rounded-xl p-4 flex flex-wrap gap-3 items-end">

      <div className="flex-1 min-w-[160px]">
        <label className={labelCls}>Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-faint" />
          <input
            type="text"
            placeholder="Keyword"
            value={values.search}
            onChange={e => update('search', e.target.value)}
            className={inputCls + ' pl-9'}
          />
        </div>
      </div>

      <div className="w-24">
        <label className={labelCls}>Min $</label>
        <input
          type="number"
          placeholder="0"
          value={values.minPrice}
          onChange={e => update('minPrice', e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="w-24">
        <label className={labelCls}>Max $</label>
        <input
          type="number"
          placeholder="Any"
          value={values.maxPrice}
          onChange={e => update('maxPrice', e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="w-32">
        <label className={labelCls}>Beds</label>
        <Select value={values.bedrooms || '__any__'} onValueChange={v => update('bedrooms', v === '__any__' ? '' : v)}>
          <SelectTrigger className="h-[38px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {BEDS.map(o => (
                <SelectItem key={o.value || '__any__'} value={o.value || '__any__'}>{o.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-32">
        <label className={labelCls}>Baths</label>
        <Select value={values.bathrooms || '__any__'} onValueChange={v => update('bathrooms', v === '__any__' ? '' : v)}>
          <SelectTrigger className="h-[38px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {BATHS.map(o => (
                <SelectItem key={o.value || '__any__'} value={o.value || '__any__'}>{o.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="w-40">
        <label className={labelCls}>Sort</label>
        <Select value={values.sort || 'newest'} onValueChange={v => update('sort', v)}>
          <SelectTrigger className="h-[38px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SORT.map(o => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {hasActive && (
        <button
          onClick={() => onChange(defaultFilters)}
          title="Clear filters"
          className="flex items-center justify-center w-[38px] h-[38px] rounded-lg border border-line bg-white text-muted hover:text-brand hover:border-brand/30 transition-colors self-end"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
