import mongoose from 'mongoose';
const { Schema } = mongoose;
import dotenv from 'dotenv';
dotenv.config();

// For security, connectionString should be in a separate file and excluded from git
const connectionString = process.env.MONGO_CREDENTIALS;

mongoose.connect(connectionString, {
    dbName: 'jsprojects',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('open', () => {
  console.log('Mongoose connected.');
});

// define data model as JSON key/value pairs
// values indicate the data type of each key
const heroSchema = new Schema({
 name: { type: String, required: true },
 class: String,
 align: String,
 level: Number
}, {
  versionKey: false
});

export const Hero = mongoose.model('Hero', heroSchema, 'heroes');