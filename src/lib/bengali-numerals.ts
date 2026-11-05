const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Renders a number the way a Bangladeshi family reads it, without changing the stored figure. */
export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, digit => BENGALI_DIGITS[Number(digit)]);
}
