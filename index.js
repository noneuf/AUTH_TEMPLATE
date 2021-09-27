import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const usersWithHashedPasswords = [
  {
    id: 1,
    name: 'Nathan Angot',
    username: 'nathan',
    password: '$2b$12$MJKtA/.bvHSwOv4tykhHyeS/Z562C1A3XvqRW.WSssukxjEp8EmAa', // qwe123
  },
  {
    id: 2,
    name: 'Joe Biden',
    username: 'sleepyJoe',
    password: '$2b$12$J96b4FSvfMgjjMjXIYyJHekaOLtpkt2tdudx9ogwTVhKOQr2OmpKa', // zxc123
  },
];

const sessions = {};

const generateTokenForUSer = (user) => {
  const sessionId = crypto.randomBytes(64).toString('hex');

  sessions[sessionId] = user.id;
  return sessionId;
};

app.post('/login', async (request, response) => {
  const username = request.body.username;
  const password = request.body.password;

  const user = usersWithHashedPasswords.find(
    (user) => user.username === username
  );

  const isPasswordTheSame =
    user && (await bcrypt.compare(password, user.password));

  if (isPasswordTheSame) {
    const sessionId = generateTokenForUSer(user);
    return response.status(200).send({
      message: `Welcome ${username}, you are successfully logged in.`,
      sessionId,
      sessions,
    });
  }

  return response.status(200).send({
    message: 'Username or password is wrong, could not log in.',
  });
});

app.listen(port, () => {
  console.log(
    `Application Authentication Backend listening at http://localhost:${port}`
  );
});
