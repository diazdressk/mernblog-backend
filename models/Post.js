import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [] /* по умолчанию [] */,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      /* автор статьи */
      type: mongoose.Schema.Types.ObjectId /* специальный тип монгуса- объект-айди */,
      ref: 'User' /* он ссылочный, ссылается на модель User */,
      required: true,
    },
    imageUrl: String, //необязательно
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Post', PostSchema);
