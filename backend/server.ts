import dotenv from 'dotenv';
import sequelize from './models';
import app from './app'; // Use this app
dotenv.config();

const PORT = process.env.PORT || 5000;

console.log("🔍 Attempting to connect to DB...");

// Connect to DB and start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Failed to connect to the database:', err);
  });

if (require.main === module) {
  console.log('👀 Running server.ts directly');
}
