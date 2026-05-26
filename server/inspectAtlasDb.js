const mongoose = require('mongoose');
require('dotenv').config();

async function inspect() {
  const uri = process.env.MONGO_URI;
  try {
    const t0 = Date.now();
    await mongoose.connect(uri);
    console.log(`Connected to Atlas MongoDB in ${Date.now() - t0}ms`);
    
    const db = mongoose.connection.db;
    
    const collections = ['blogs', 'projects'];
    for (const colName of collections) {
      console.log(`\n--- Inspecting Collection: ${colName} ---`);
      const col = db.collection(colName);
      
      const count = await col.countDocuments();
      console.log(`Total Documents: ${count}`);
      
      if (count > 0) {
        // Measure projection _id: 1 latency
        const t1 = Date.now();
        const ids = await col.find({}, { projection: { _id: 1 } }).toArray();
        console.log(`Querying ids (_id: 1) took ${Date.now() - t1}ms`);
        
        // Measure Aggregation sizes using $bsonSize
        const t2 = Date.now();
        const sizes = await col.aggregate([
          { $project: { _id: 1, size: { $bsonSize: "$$ROOT" }, title: 1 } }
        ]).toArray();
        console.log(`Aggregation sizes took ${Date.now() - t2}ms`);
        
        sizes.forEach(s => {
          console.log(`Document [${s.title || s._id}] Size: ${(s.size / 1024).toFixed(2)} KB (${s.size} bytes)`);
        });
        
        // Check if there are large fields
        const sampleDoc = await col.findOne({});
        console.log('\nField lengths in sample document:');
        for (const k in sampleDoc) {
          const val = sampleDoc[k];
          if (typeof val === 'string') {
            console.log(`  - ${k}: ${val.length} characters ${val.startsWith('data:image') ? '(Base64 Data URI)' : ''}`);
          } else if (Array.isArray(val)) {
            console.log(`  - ${k}: Array of length ${val.length}`);
          } else {
            console.log(`  - ${k}: ${typeof val}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

inspect();
