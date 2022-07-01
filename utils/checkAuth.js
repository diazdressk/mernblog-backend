import jwt from 'jsonwebtoken';
/* функция миддлвеир проверки авторизации */
export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(
    /Bearer\s?/,
    '',
  ); /* тут у меня призодит слово Бирер и токен, удаляю слово Бирер */

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret');/* расшифровываю токен */
      req.userId = decoded._id;/* забираю айдишник,засовываю в реквест,чтоб дальше с ним работать */
      next(); /* говорит о том, что можно работать дальше */
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'Нет доступа' });
    }
  } else {
    return res.status(403).json({ message: 'Нет доступа' });
  }
};
