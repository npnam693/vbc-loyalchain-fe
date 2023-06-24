// import axios from "axios";

// async function getBase64(link_array: string | any[] | undefined) {
//   if (link_array) {
//     let file_result: any[] = [];
//     for (let i = 0; i < link_array.length; i++) {
//       if (link_array[i].preview) {
//         let response = axios.get(link_array[i].preview, {
//           responseType: "arraybuffer",
//         });
//         await Promise.resolve(response).then(async function (result) {
//           file_result.push(
//             Buffer.from(result.data, "binary").toString("base64")
//           );
//         });
//       }
//     }
//     return file_result;
//   }
// }

// export { getBase64 };
const alo = true;
export {alo}