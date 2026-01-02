import { connectToDatabase } from '../database/mongoose';


async function main() {
    try {
        await connectToDatabase()
        // If connectToDatabase resolves without throwing, connection is OK
        console.log("Ok, Database connection succeeded")
        process.exit(0)
    } catch (error) {
        console.log("Error!, Database connection failed")
        console.log('Error', error)
        process.exit(1)
    }
}

main();
