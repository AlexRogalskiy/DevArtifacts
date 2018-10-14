export const required = (value, criterion) => {
    const defined = ![undefined, null, ''].includes(value);
    const result = criterion ? defined : true;
    return result;
};

export const pattern = (value, pattern) => {
    if([undefined, null].includes(value))
        return false;
    const result = value.match(pattern) ? true : false;
    return result;
};

export const minLength = (value, min) => {
    if([undefined, null].includes(value))
        return true;

    const result = value.length >= Number(min);
    return result;
};

export const maxLength = (value, max) => {
    if([undefined, null].includes(value))
        return true;
    const result = value.length <= Number(max);
    return result;
};

export const min = (value, min) => {
    if([undefined, null].includes(value) || isNaN(value))
        return true;
    const result = Number(value) >= Number(min);
    return result;
};

export const max = (value, max) => {
    if([undefined, null].includes(value) || isNaN(value))
        return true;
    const result = Number(value) <= Number(max);
    return result;
};