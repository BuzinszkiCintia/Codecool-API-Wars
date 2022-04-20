let db = null;

const init = async (fp) => {
  const lowdb = await import("lowdb"); //require promise-os megfelelője
  const adapter = new lowdb.JSONFile(fp);
  db = new lowdb.Low(adapter);
  await db.read();
  db.data ||= { users: [] };
  return db.write();
};

const getAllUser = async () => {
  await db.read();
  return db.data.users;
};
const findUserByUserName = async (userName) => {
  await db.read();
  return db.data.users.find((user) => {
    return user.userName === userName;
  });
};
const createUser = async (user) => {
  await db.read();
  db.data.users.push(user);
  return db.write();
};

module.exports = {
  init,
  getAllUser,
  findUserByUserName,
  createUser,
};
