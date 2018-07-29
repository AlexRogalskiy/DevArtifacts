/**
 * Reformat your number with commas.
 */
const numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export { numberWithCommas };
