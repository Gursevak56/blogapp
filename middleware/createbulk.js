// createbulk.js

const User = require('./../models/user');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

const createbulk = async () => {
  try {
    const users = await User.find();
    const body = users.flatMap((doc) => [
      {
        index: { _index: 'data', _id: doc._id.toString() },
      },
      {
        // Exclude the _id field from the indexed document
        username: doc.username,
        email:doc.email,
        phonenumber:doc.phoneNumber
        // Include other fields you want to index here
        // For example: title: doc.title, content: doc.content, etc.
      },
    ]);

    if (body.length > 0) {
      console.log('Bulk body created successfully');
      const response = await client.bulk({ body: body, refresh: true });

      console.log('Bulk data inserted successfully');

      if (response.body.errors) {
        response.body.items.forEach((item) => {
          console.log(item.index.error);
        });
      }
    } else {
      console.log('No data available, so the body cannot be created');
    }
  } catch (error) {
    console.log(error.meta.body.error);
  }
};

module.exports = createbulk;
