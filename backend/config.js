const credentials = {
  user: 'idlikesometea',
  password: process.env.MONGO_ATLAS_PW
};

const uri = `mongodb+srv://${credentials.user}:${credentials.password}@cluster0-yzem9.mongodb.net/node-angular?w=majority`;

module.exports = uri;
