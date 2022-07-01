import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

mongoose
  .connect(
    'mongodb+srv://aalt:ilove1993@cluster0.ede50sz.mongodb.net/blog?retryWrites=true&w=majority' /* blog?- база данных */,
  )
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.log('DB ERRoRr: ', err));

const app = express();

const storage = multer.diskStorage({
  /* хранилище для файлов */
  destination: (_, __, cb) => {
    /* путь, сохраняю в uploads */
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    /* название файла */
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); /* функция, чтоб использовать мультер */

app.use(express.json());
app.use(cors()); /* cors нужен,чтоб разблокировать запросы с локал хоста */
app.use(
  '/uploads',
  express.static('uploads'),
); /* чтобы express искал статичный файл,когда будет приходить запрос на роут /uploads */
/* это гет запрос для на получение статичного файла! */

app.post(
  '/upload',
  checkAuth,
  upload.single('image' /* миддлвейр,говорит,что принимает имаге */),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}` /* после загрузки изображению,сохраняю его и отдаю ссылку на него во фронт */,
    });
  },
);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  postCreateValidation,
  checkAuth,
  handleValidationErrors,
  PostController.update,
);

app.listen(4444, (err) => {
  if (err) return console.log(err);
  console.log('Server work');
});
