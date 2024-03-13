export const VOWELS_SET = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']);
export const VOWELS_REGEX = new RegExp(`(${Array.from(VOWELS_SET).join('|')})`, 'gi');
