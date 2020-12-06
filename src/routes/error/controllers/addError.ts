import { Context, Next } from 'koa';
import { Types } from 'mongoose';
import Error, { IError, IErrorDocument } from '../../../models/Error';
import Issue from '../../../models/Issue';
// message, stack, type이 같은 경우 동일 에러 종류로 분류
// project
export default async (ctx: Context, next: Next): Promise<void> => {
  const newError: IError = ctx.request.body;
  const { projectId } = ctx.params;
  newError.meta.ip = ctx.header.host;
  try {
    const newErrorDoc: IErrorDocument = Error.build(newError);
    const res = await newErrorDoc.save();
    await Issue.findOneAndUpdate(
      {
        projectId: Types.ObjectId(projectId),
        message: newError.message,
        stack: newError.stack,
        type: newError.type,
      },
      {
        $push: { errorIds: res._id },
      },
      {
        new: true,
        upsert: true,
      },
    );
    ctx.response.status = 200;
  } catch (e) {
    ctx.throw(400, 'validation failed');
  }

  await next();
};
