import { add } from 'date-fns';

const units = {
  s: 'seconds',
  m: 'minutes',
  h: 'hours',
  d: 'days',
  undefined: '',
};

export const addTImeToCurrentDate = (time: string): string => {
  const regex = /(\d{1,})([s | m | h | d])/g;
  const matchAll = Array.from(time.matchAll(regex));
  const firsMatch = matchAll[0];
  const unitNeedToAddCut = firsMatch[2];
  const valueNeedToAdd = +firsMatch[1];

  let field;
  switch (unitNeedToAddCut) {
    case 'm':
      field = units.m;
      break;
    case 'h':
      field = units.h;
      break;
    case 'd':
      field = units.d;
      break;
    case 's':
    default:
      field = units.s;
  }

  const result = add(new Date(), {
    [field]: valueNeedToAdd,
  });

  return result.toISOString();
};
