import md5 from './md5.js'
import cryptoJS from './crypto.js'
/**
 * 数据加密
 */
function encrypt(data, ekey) {
    data = cryptoJS.enc.Utf8.parse(data);
    var md5Key = md5.hex_md5(ekey);
    var key = cryptoJS.enc.Latin1.parse(md5Key.substring(0, 16));
    var iv = cryptoJS.enc.Latin1.parse(md5Key.substring(16, 32));
    var encrypted = cryptoJS.AES.encrypt(data, key, { iv: iv, mode: cryptoJS.mode.CBC, padding: cryptoJS.pad.ZeroPadding });
    return urlsafe_b64encode(encrypted.toString());
}
/**
 * 数据解密
 */
function decrypt(word, ekey) {
    word = urlsafe_b64decode(word);
    var md5Key = md5.hex_md5(ekey);
    var key = cryptoJS.enc.Latin1.parse(md5Key.substring(0, 16));
    var iv = cryptoJS.enc.Latin1.parse(md5Key.substring(16, 32));
    var decrypted = cryptoJS.AES.decrypt(word, key, { iv: iv, mode: cryptoJS.mode.CBC, padding: cryptoJS.pad.ZeroPadding });
    return cryptoJS.enc.Utf8.stringify(decrypted).toString();
}
function urlsafe_b64encode(base64Str) {
    var safeB64 = base64Str.replace(/\+/g, "-");
    safeB64 = safeB64.replace(/\//g, "_");
    safeB64 = safeB64.replace(/\=/g, "");
    return safeB64;
}
function urlsafe_b64decode(base64Str) {
    var safeB64 = base64Str.replace(/\-/g, "+");
    safeB64 = safeB64.replace(/\_/g, "/");
    var mod4 = safeB64.length % 4;
    var modAddStr = "====";
    safeB64 = safeB64 + modAddStr.substring(0, mod4);
    return safeB64;
}
export default {
    encrypt,
    decrypt
}