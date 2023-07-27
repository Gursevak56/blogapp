const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });
const User = require('./user');
const { text } = require('body-parser');

const createindex = async () => {
  try {
  const response = await client.indices.create({
    index:"data",
    body:{
      mappings:{
        properties:{
          username:{type:'text'},
          email:{type:'text'},
          phoneNumber:{type:'text'}
        }
      }
    }
    })
    console.log(response)
  } catch (error) {
    console.log(error.message);
  }
};

 createindex();
const gettitle = async ()=>{
  const response = await client.get({
    index:"users",
    id:1
  })
  console.log(response)
}
//gettitle();
 const createusers = async ()=>{
  const users = await User.find();
  console.log(users)
  const body = users.flatMap((doc,index)=>[{index:{_index:"users",id:index+1}}
 ,doc])
const response = await client.bulk({body:body,refresh:true});
console.log(response)
}
// const getcount = async ()=>{
//   const count = await client.count({
//     index:"users",
//     id:1
//   })
//   console.log(count)
// }
// getcount();

// const createindex = async () => {
//   try {
//     const users = [
//       {
//         username: "gursevak",
//         email: "gursevaksinghgill21@gmail.com",
//         phoneNumber: "7037772781",
//       },
//       // Add more user documents as needed
//     ];

//     const body = users.flatMap((user, index) => [
//       { index: { _index: "users", _id: index + 1 } },
//       user,
//     ]);

//     const response = await client.bulk({ body: body, refresh: true });
//     console.log(response);
//   } catch (error) {
//     console.log(error.message);
//   }
//};
