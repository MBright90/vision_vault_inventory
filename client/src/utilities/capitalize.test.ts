import capitalize from "./capitalize";

test('capitalizes the first letter of a single word', () => {
    expect(capitalize('hello')).toBe('Hello');
});

test('capitalizes the first letter and removes leading/trailing whitespace', () => {
    expect(capitalize(' hello ')).toBe('Hello');
});

test('returns an empty string when input is an empty string', () => {
    expect(capitalize('')).toBe('');
});

test('capitalizes the first letter and keeps the rest of the string unchanged', () => {
    expect(capitalize('hELLO')).toBe('HELLO');
});

test('removes leading/trailing whitespace and capitalizes the first letter', () => {
    expect(capitalize('   world   ')).toBe('World');
});

test('handles strings with only whitespace correctly', () => {
    expect(capitalize('   ')).toBe('');
});

test('handles special characters correctly', () => {
    expect(capitalize('!hello')).toBe('!hello');
});

test('handles strings with multiple words correctly', () => {
    expect(capitalize('hello world')).toBe('Hello world');
});