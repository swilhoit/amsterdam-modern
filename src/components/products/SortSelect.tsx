'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  currentSort: string;
  slug: string;
}

export function SortSelect({ currentSort, slug }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`/category/${slug}?${params.toString()}`);
  };

  return (
    <select
      id="sort"
      defaultValue={currentSort}
      onChange={handleChange}
      className="bg-transparent border border-border px-4 py-2 text-sm focus:outline-none focus:border-warm cursor-pointer"
    >
      <option value="newest">Newest to Oldest</option>
      <option value="oldest">Oldest to Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name-az">Name: A–Z</option>
      <option value="name-za">Name: Z–A</option>
    </select>
  );
}
