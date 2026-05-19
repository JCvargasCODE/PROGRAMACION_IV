require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════');
  console.log(` StudySync API · http://localhost:${PORT}`);
  console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════════');
});