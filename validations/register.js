import validator from "express-validator";

export const registerValidations = [
  validator
    .body("email", "Введите почту")
    .isEmail()
    .withMessage("Неверный E-Mail")
    .isLength({
      min: 10,
      max: 40,
    })
    .withMessage("Неверный E-Mail, минимум 10 символов"),

  validator
    .body("fullname", "Введите имя")
    .isString()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("Неверный E-Mail, минимум 10 символов"),

  validator
    .body("username", "Введите логин")
    .isString()
    .isLength({
      min: 2,
      max: 30,
    })
    .withMessage("Введите логин"),

  validator
    .body("password", "Введите пароль")
    .isString()
    .isLength({
      min: 8,
      max: 50,
    })
    .withMessage("Пароль должен иметь минимум 8 символов")
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Пароли не совпадают");
      } else {
        return value;
      }
    }),
];
