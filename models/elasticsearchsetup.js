const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });
const User = require('./user');

const createindex = async () => {
  try {
  const response = await client.create({
    index:"username",
    id:1,
    body:{
      username:"gursevak",
      email:"gursevaksinghgill21@gmail.com",
      phoneNumber:"7037772781"
    }
    })
  } catch (error) {
    console.log(error.message);
  }
};

// createindex();
const gettitle = async ()=>{
  const response = await client.get({
    index:"username",
    id:1
  })
  console.log(response)
}
gettitle();