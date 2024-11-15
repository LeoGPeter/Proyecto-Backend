// src/config/mongo.js
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://leopeter98:Peter75745@cluster0.vrd1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "ecommerce"
    });
    console.log('🟢 Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
