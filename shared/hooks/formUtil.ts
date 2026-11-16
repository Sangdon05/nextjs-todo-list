'use client';

import { ChangeEvent, useState } from 'react';

type ElementType = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function useInputs<T>(
  initialState: T,
): [form: T, onChange: (e: ChangeEvent<ElementType>) => void] {
  const [from, setFrom] = useState(initialState);
  const onChange = (e: ChangeEvent<ElementType>) =>
    setFrom((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return [from, onChange];
}
