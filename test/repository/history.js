const Repo = require('../../lib/repository/history.js').repository

const cls = new Repo();

async function test () {
  const add = await cls.add(1,2)
  const find = await cls.findByCard(1)
  const find2 = await cls.findByCard(1, 1, false)
  const find3 = await cls.findByCard(9999999, 1, false)
  console.log(add)
  console.log(find)
  console.log(find2)
  console.log(find3)
}
const hoge = test()
