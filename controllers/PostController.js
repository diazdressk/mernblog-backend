import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('user')
      .exec(); /* беру все статьи,....связываю с моделью про usera -.populate('user').exec(); чтобы узнать о юзере */

    res.json(posts); /* отправляю на фронт */
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec(); /* беру последние 5 статей*/
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5); /* первые 5 тегов */

    res.json(tags); /* отправляю на фронт */
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      /* нахожу статью по айдишнику и обвноляю его */
      {
        /* 1 параметр- айдишник, по которому нахожу статью */ _id: postId,
      },
      {
        /* 2 параметр- обновление ключа viewsCount, инкремент на 1 */ $inc: { viewsCount: 1 },
      },
      { /*3 параметр- возращаю статью после обновления*/ returnDocument: 'after' },
      /* 4 парметр функция для получения из базы в бэк для дальнейшей отправки на фронт и обработка в случае ошибки */ (
        error,
        doc,
      ) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Не удалось получить статью',
          });
        }
        if (!doc) {
          /* если статья не нашлась */ console.log(error);
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json(doc); /* если всё ок, возвращаю статью. */
      },
    ).populate('user');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete(
      /* нахожу статью по айдишнику и удаляю его */
      {
        /* 1 параметр- айдишник, по которому нахожу статью */ _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }
        if (!doc) {
          /* если статья не нашлась */ console.log(error);
          return res.status(500).json({
            message: 'Статья не найдена',
          });
        }
        res.json({
          success: true,
        }); /* если удалилсь статья, отправляю на фронт Ок */
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      /* нахожу статью по айдишнику и удаляю его */
      {
        /* 1 параметр- айдишник, по которому нахожу статью */ _id: postId,
      },
      {
        /* обвноленные данные вставляю */
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    );

    res.json({
      success: true,
    }); /* если удалилсь статья, отправляю на фронт Ок */
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
