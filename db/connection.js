import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        console.log(process.env.MONGO_URL)
        const connectionData = await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected',connectionData.connection.host)
    }
    catch(err){
        console.log('Error in mongodb connection',err)
    }
}

export default connectDB