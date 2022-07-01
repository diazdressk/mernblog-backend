// import { body } from 'express-validator';
import validator from 'express-validator';
const { body } = validator;


export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль минимум 5 символов').isLength({ min: 5 }),
  body('fullName', 'Имя обязательно').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль минимум 5 символов').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'Неверный формат тэгов').isLength({ min: 3 }).optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
