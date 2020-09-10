const regNumberOnly = /^[0-9]+$/ ;

export const thousand = val => (
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
);

export const isNumberOnly = value => regNumberOnly.test(value);