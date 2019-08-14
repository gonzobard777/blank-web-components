
export function isEqualsSimple(value1: string, value2: string): boolean {
    const v1 = JSON.stringify(value1);
    const v2 = JSON.stringify(value2);
    return v1 === v2;
}

export function randomStr(requiredStringLength,
                          prefix = '',
                          postfix = ''): string { // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let result = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < requiredStringLength; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return prefix + result + postfix;
}

export function getLocationBase(): string {
    const arr = location.pathname.split('/');
    arr.pop();
    return arr.join('/');
}
