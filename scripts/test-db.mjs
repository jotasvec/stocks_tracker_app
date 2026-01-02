import "dotenv/config";
import mongoose from "mongoose";

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.log("Error, mongodb must be set in .env file")
        process.exit(1);
    }

    try {
        const startedAt = Date.now();
        await mongoose.connect(uri, { bufferCommands: false });
        const elapsed = Date.now() - startedAt;

        const dbName = mongoose.connection?.name || '(unknown)';
        const host = mongoose.connection?.host || '(unknown)';

        console.info(`Connection OK: Connected to MongoDB [db="${dbName}", host="${host}", time="${elapsed}ms"]`);
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error: Database connection failed');
        console.error(err);
        
        try {
            await mongoose.connection.close(); 
        } catch{}
        process.exit(1);
    }
}

main();