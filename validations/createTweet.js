import { body } from "express-validator";

export const createTweetsValidations = [
  body("text", "Введите текст")
    .isString()
    .isLength({
      min: 0,
      max: 280,
    })
    .withMessage("Максимальная длина твита 280 символов"),
];
