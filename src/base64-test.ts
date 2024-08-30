export default function isBase64(str:string) {
    if (str.length % 4 !== 0) {
        return false;
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    return base64Regex.test(str);
}
