
const getPasswordGenerator = () => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const number = "0123456789";
    const symbol = "!@#$%^&*()";
    const uppercaseLength = 1;
    const lowercaseLength = 5;
    const numberLength = 2;
    const symbolLength = 1;
    let password = "";
    for (let i = 0; i < uppercaseLength; i++) {
      const randomNumber = Math.floor(Math.random() * uppercase.length);
      password += uppercase.substring(randomNumber, randomNumber + 1);
    }
    for (let i = 0; i < lowercaseLength; i++) {
      const randomNumber = Math.floor(Math.random() * lowercase.length);
      password += lowercase.substring(randomNumber, randomNumber + 1);
    }
    for (let i = 0; i < numberLength; i++) {
      const randomNumber = Math.floor(Math.random() * number.length);
      password += number.substring(randomNumber, randomNumber + 1);
    }  
    for (let i = 0; i < symbolLength; i++) {
      const randomNumber = Math.floor(Math.random() * symbol.length);
      password += symbol.substring(randomNumber, randomNumber + 1);
    }
    return password;
}

export default {
  getPasswordGenerator
}