const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/ajnabh';
const remoteUri = 'mongodb://ajnabh_infotech:Ajnabh@ac-tdavigw-shard-00-00.m5otumx.mongodb.net:27017,ac-tdavigw-shard-00-01.m5otumx.mongodb.net:27017,ac-tdavigw-shard-00-02.m5otumx.mongodb.net:27017/ajnabh?ssl=true&replicaSet=atlas-5r3t8c-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  let localConn = null;
  let remoteConn = null;

  try {
    console.log('Connecting to local MongoDB...');
    localConn = await mongoose.createConnection(localUri).asPromise();
    console.log('Connected to local MongoDB successfully.');

    console.log('Connecting to MongoDB Atlas...');
    remoteConn = await mongoose.createConnection(remoteUri).asPromise();
    console.log('Connected to MongoDB Atlas successfully.');

    const localDb = localConn.db;
    const remoteDb = remoteConn.db;

    const collections = await localDb.listCollections().toArray();
    console.log(`\nFound ${collections.length} collections locally. Starting migration...\n`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`----------------------------------------`);
      console.log(`Migrating collection: "${colName}"`);

      // Get local collection and find all documents
      const localCol = localDb.collection(colName);
      const docs = await localCol.find({}).toArray();
      console.log(`- Read ${docs.length} documents from local collection.`);

      // Get remote collection
      const remoteCol = remoteDb.collection(colName);

      // Clear existing data on remote collection
      const deleteResult = await remoteCol.deleteMany({});
      console.log(`- Cleared ${deleteResult.deletedCount} existing documents in remote collection.`);

      if (docs.length > 0) {
        // Insert documents into remote collection
        const insertResult = await remoteCol.insertMany(docs);
        console.log(`- Successfully inserted ${insertResult.insertedCount} documents into MongoDB Atlas.`);
      } else {
        console.log(`- Collection is empty, skipping insertion.`);
      }
    }

    console.log(`\n========================================`);
    console.log(`Migration completed successfully! 🎉`);
    console.log(`========================================`);

  } catch (error) {
    console.error('\n❌ Migration failed with error:', error);
  } finally {
    if (localConn) await localConn.close();
    if (remoteConn) await remoteConn.close();
    console.log('Connections closed.');
  }
}

migrate();
