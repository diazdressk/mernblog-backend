import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
// import { validationResult } from 'express-validator';
import validator from 'express-validator';
const { validationResult } = validator;

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    }); /* ищу пользователеля по email */

    if (!user) {
      return res
        .status(404) /* не удалось залогиниться  */
        .json({ message: 'Неверный логин или пароль' /* специально пишу так */ });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    ); /* сравнивниваю введенный пароль с тем,что есть в базе */

    if (!isValidPass) {
      /* если пароли не совпадают, отправляю текст ошибки во фронт, но не говорю ему изза чего именно */
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret' /*ключ шифровки*/,
      {
        expiresIn: '30d' /*токен будет работать 30 дней*/,
      },
    );

    const { passwordHash, ...userData } =
      user._doc; /* убираю passwordHash,тк он не нужен на фронте, остально отравлю во фронт */

    res.json({
      ...userData /* данные о пользователе и токен */,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const register = async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); /*алгоритм шифрования*/
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save(); //запись в бд

    const token = jwt.sign(
      /* создаю токен */
      {
        _id: user._id,
      },
      'secret' /*ключ шифровки*/,
      {
        expiresIn: '30d' /*токен будет работать 30 дней*/,
      },
    );

    const { passwordHash, ...userData } =
      user._doc; /* убираю passwordHash,тк он не нужен на фронте, остально отравлю во фронт */

    res.json({
      ...userData /* данные о пользователе и токен */,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(
      req.userId,
    ); /* по переданному из chechAuth айдишнику, нахожу пользователя в базе */
  
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { passwordHash, ...userData } =
      user._doc; /* убираю passwordHash,тк он не нужен на фронте, остально отравлю во фронт */

    res.json(userData);
    // res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
