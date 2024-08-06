const capitalize = (string: string): string => {
    const trimmedString = string.trim();
    if (trimmedString.length > 0) {
        const splitString = trimmedString.split('');
        if (splitString[0].match(/[a-zA-Z]/i)) splitString[0] = splitString[0].toUpperCase();
        return splitString.join().replaceAll(',', '').trim();
    }
    return '';
};

export default capitalize;
