import { Context, Next } from 'koa';

import CryptoJS from 'crypto-js';
import sendMail from '../../../utils/sendMail';
import inviteMemberTemplate from '../../../utils/mailTemplate/inviteMember';
import Invite, { IInvite, InviteDocument } from '../../../models/Invite';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { to, project, projectId } = ctx.request.body;
  const info: any[] = [];
  await to.forEach(async (email: string) => {
    const json = {
      email,
      projectId,
    };
    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(json),
      process.env.INVITE_SECRET_KEY as string,
    ).toString();
    const newInvite: IInvite = {
      key: ciphertext,
      expire: new Date().getTime() + 3600,
    };
    const newInviteDoc: InviteDocument = new Invite(newInvite);
    await newInviteDoc.save();

    const body = {
      to: [email],
      ...inviteMemberTemplate(project, encodeURIComponent(ciphertext)),
    };

    const res = await sendMail(body);
    info.push(res);
  });

  ctx.body = info;
  await next();
};
