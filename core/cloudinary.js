import cloudinary from "cloudinary";

// if (!process.env.CLOUD_NAME) {
//   throw new Error("Отсутствует конфигурация для Cloudinary");
// }

cloudinary.config({
  cloud_name: "dbuvupbaa",
  api_key: 534638611426617,
  api_secret: "FIrPrXSOuIWRLSBl7WZ_m6CrB0Q",
});

export default cloudinary;
