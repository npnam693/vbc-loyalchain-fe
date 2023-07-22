const truncate = (str: string, n: number) => {
  return str && str.length > n ? str.substring(0, n - 1) + "..." : str;
};

const parsePhone  = (str: string) => {
  let indexOf = str.indexOf("+84");
  if (indexOf === 0) {
    let phone = str.split(" ").join("");
    phone = "0" + phone.substring(3, phone.length);
    return phone;
  } else {
    return str;
  }
}

function shortenAddress(address : string) {
  const maxLength = 10; // Độ dài tối đa của địa chỉ rút gọn
  const ellipsis = '...'; // Ký tự đại diện cho phần còn lại của địa chỉ

  if (address.length <= maxLength) {
    return address; // Trả về nguyên địa chỉ nếu độ dài không vượt quá maxLength
  } else {
    const prefixLength = Math.floor((maxLength - ellipsis.length) / 2);
    const suffixLength = maxLength - prefixLength - ellipsis.length;
    const prefix = address.substr(0, prefixLength);
    const suffix = address.substr(address.length - suffixLength);
    return prefix + ellipsis + suffix;
  }
}

function fixStringBalance(balance:string, decimal: number){
  console.log(balance.length)
  if (balance.length < 15) return '0';

  for (let i = balance.length - 1; i >= 0; i--){
    if (balance[i] === '0' && decimal > 0) {
      decimal = decimal - 1;
    } else {
      balance = balance.slice(0, i+1) 
      break;
    };
  }
  const idxDot : number = balance.length - decimal;

  console.log(idxDot, balance)


  if(idxDot < 0){
    return "0." + "0".repeat(-idxDot) + balance.slice(0, 3);
  }
  else if (idxDot === balance.length){
    return balance
  }
  else if (idxDot === 0) {
    return '0.' + balance;
  }
  else {
    return balance.slice(0, idxDot) + "." + balance.slice(idxDot, idxDot + 3);
  }
}

export { truncate , parsePhone, shortenAddress, fixStringBalance };

