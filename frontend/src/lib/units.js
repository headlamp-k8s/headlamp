/*
 * This module was taken from the k8dash project.
 */

 import _ from 'lodash';

const RAM_TYPES = ['Bi', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei'];
const UNITS = ['B', 'K', 'M', 'G', 'T', 'P', 'E'];

export const TO_GB = 1024 * 1024 * 1024;
export const TO_ONE_M_CPU = 1000000;
export const TO_ONE_CPU = 1000000000;

export function parseDiskSpace(value) {
    return parseUnitsOfBytes(value);
}

export function parseRam(value) {
    return parseUnitsOfBytes(value);
}

function parseUnitsOfBytes(value) {
    if (!value) return 0;

    const groups = value.match(/(\d+)([BKMGTPEe])?(i)?(\d+)?/);
    const number = parseInt(groups[1], 10);

    // number ex. 1000
    if (groups[2] === undefined) {
        return number;
    }

    // number with exponent ex. 1e3
    if (groups[4] !== undefined) {
        return number * (10 ** parseInt(groups[4], 10));
    }

    const unitIndex = _.indexOf(UNITS, groups[2]);

    // Unit + i ex. 1Ki
    if (groups[3] !== undefined) {
        return number * (1024 ** unitIndex);
    }

    // Unit ex. 1K
    return number * (1000 ** unitIndex);
}

export function unparseRam(value) {
    let i = 0;
    while (value >= 1024 && i < RAM_TYPES.length - 1) {
        i++;
        value /= 1024; // eslint-disable-line no-param-reassign
    }

    return {
        value: _.round(value, 1),
        unit: RAM_TYPES[i],
    };
}

export function parseCpu(value) {
    if (!value) return 0;

    const number = parseInt(value, 10);
    if (value.endsWith('n')) return number;
    if (value.endsWith('u')) return number * 1000;
    if (value.endsWith('m')) return number * 1000 * 1000;
    return number * 1000 * 1000 * 1000;
}

export function unparseCpu(value) {
    const result = parseFloat(value);

    return {
        value: _.round(result / 1000000, 2),
        unit: 'm',
    };
}
