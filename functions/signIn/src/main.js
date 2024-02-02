import { Client, Users, Query, ID } from 'node-appwrite';
import * as axios from 'axios';

export default async ({ req, res, log }) => {
  const client = new Client()
    .setEndpoint('https://qa.appwrite.org/v1')
    .setProject('65ba4eeeaac022ea46fb')
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  const body = JSON.parse(req.bodyRaw ?? '{}');
  const { email, typingPattern } = body;

  const response = await users.list([
    Query.equal('email', email),
    Query.limit(1),
  ]);

  let userId = (response.users[0] ?? []).$id ?? null;

  if (!userId) {
    userId = (await users.create(ID.unique(), email)).$id;
  }

  const typingDna = await axios.default.post(
    'https://api.typingdna.com/auto/' + userId,
    JSON.stringify({
      tp: typingPattern,
    }),
    {
      auth: {
        username: process.env.TYPINGDNA_API_KEY,
        password: process.env.TYPINGDNA_API_SECRET,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  log(typingDna.data);

  if (typingDna.data.result !== 1 || typingDna.data.high_confidence !== 1) {
    return res.json({
      ok: false,
      msg: 'Typing pattern did not match'
    })
  }

  const token = await users.createToken(userId);
  const secret = token.secret;

  return res.json({
    ok: true,
    userId,
    secret,
  });
};
