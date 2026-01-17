import mongoose from 'mongoose';

const uri = "mongodb+srv://jrymnd:itslorcan18@cluster0.zegt9qg.mongodb.net/TodoAppDB?retryWrites=true&w=majority";

mongoose.connect(uri).then(() => {
  console.log('Connected to MongoDB Atlas');
  const db = mongoose.connection.db;
  const users = db.collection('users');
  
  users.find({}).toArray().then(docs => {
    console.log('Users in database:', docs.length);
    docs.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        hasPassword: !!user.password
      });
    });
    mongoose.connection.close();
  }).catch(err => {
    console.error('Error finding users:', err);
    mongoose.connection.close();
  });
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});
