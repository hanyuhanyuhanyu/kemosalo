const Repo = require('../../lib/repository/history.js').repository

const cls = new Repo();

async function test () {
  const add = await cls.add(1,2)
  const find = await cls.findByCard(1)
  console.log(add)
  console.log(find)
}
const hoge = test()
