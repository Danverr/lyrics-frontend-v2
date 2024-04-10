export const VOWELS_SET = new Set([
	'а',
	'е',
	'ё',
	'и',
	'о',
	'у',
	'ы',
	'э',
	'ю',
	'я',
	'А',
	'Е',
	'Ё',
	'И',
	'О',
	'У',
	'Ы',
	'Э',
	'Ю',
	'Я'
]);
export const VOWELS_REGEX = new RegExp(`(${Array.from(VOWELS_SET).join('|')})`, 'gi');
