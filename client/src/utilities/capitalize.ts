const capitalize = (string: string): string => {
    if (string.length > 0) {
        const splitString = string.trim().split('');
        splitString[0] = splitString[0].toUpperCase();
        return splitString.join().replaceAll(',', '');
    }
    return '';
};

export default capitalize;
