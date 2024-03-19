const capitalize = (string: string): string => {
    const splitString = string.trim().split('');
    splitString[0] = splitString[0].toUpperCase();
    return splitString.join().replaceAll(',', '');
};

export default capitalize;
