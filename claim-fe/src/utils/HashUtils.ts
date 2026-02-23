import CryptoJS from "crypto-js";

const secretToken = "kucingmaumandi";

const encryptWithPrivateKey = (
  inputString: string,
): string => {
  const encrypted = CryptoJS.AES.encrypt(inputString, secretToken).toString();
  return encrypted;
};

const decryptWithPrivateKey = (
  encryptedString: string,
): string => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, secretToken);
  const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
};

const encryptMd5 = (encryptedString: string): string => {
  const encrypt = CryptoJS.MD5(encryptedString).toString();
  return encrypt;
};

export {encryptWithPrivateKey, decryptWithPrivateKey, encryptMd5};
