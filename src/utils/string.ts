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

export { truncate , parsePhone };
