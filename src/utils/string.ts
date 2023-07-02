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
  let str = balance.toString();
  const idxDot : number = str.length - decimal;
  console.log('CC', idxDot)
  if(idxDot <= 0){
    return "0." + "0".repeat(-idxDot) + str.slice(0, 3);
  }
  else {
    return str.slice(0, idxDot) + "." + str.slice(idxDot, idxDot + 3);
  }
}

export { truncate , parsePhone, shortenAddress, fixStringBalance };

