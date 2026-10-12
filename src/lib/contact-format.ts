export function formatBangladeshPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  const local = digits.startsWith('880') ? `0${digits.slice(3)}` : digits;

  if (local.length === 11) {
    return `${local.slice(0, 5)}-${local.slice(5)}`;
  }

  return value;
}
