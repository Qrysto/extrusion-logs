'use client';

import { useEffect, useState } from 'react';
import { draftLogsKey } from '@/lib/const';
import { genId } from '@/lib/utils';
import { formatDate } from '@/lib/dateTime';
import { FullFormValues, Draft } from './types';

let _drafts: Draft[] = [];
const _listeners: Listener[] = [];

function loadDrafts() {
  const json = localStorage.getItem(draftLogsKey);
  if (json) {
    try {
      const drafts = JSON.parse(json).map((draft: any) => ({
        ...draft,
        date: draft.date && formatDate(new Date(draft.date)),
      }));
      set(drafts);
    } catch (err) {}
  }
}

function set(newDrafts: Draft[]) {
  _drafts = newDrafts;
  localStorage.setItem(draftLogsKey, JSON.stringify(newDrafts));
  _listeners.forEach((listener) => {
    listener(_drafts);
  });
}

function addDraft(values: FullFormValues) {
  const newDraft = {
    id: `draft-${genId()}`,
    isDraft: true,
    ...values,
  } as Draft;
  set([newDraft, ..._drafts]);
}

function updateDraft(id: string, values: FullFormValues) {
  const index = _drafts.findIndex((draft) => draft.id === id);
  if (index < 0) {
    throw new Error(`Draft with ID '${id}' not found!`);
  }
  const newDrafts = [..._drafts];
  newDrafts[index] = {
    id,
    isDraft: true,
    ...values,
  } as Draft;
  set(newDrafts);
}

function removeDraft(id: string) {
  set(_drafts.filter((draft) => draft.id !== id));
}

function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>(_drafts);
  useEffect(() => {
    _listeners.push(setDrafts);
    loadDrafts();
    return () => {
      const index = _listeners.indexOf(setDrafts);
      if (index >= 0) {
        _listeners.splice(index, 1);
      }
    };
  }, []);

  return { drafts };
}

type Listener = (drafts: Draft[]) => void;

export { useDrafts, addDraft, updateDraft, removeDraft };
