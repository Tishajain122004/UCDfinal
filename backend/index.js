require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8001;

// Middlewares
app.use(cors());
app.use(express.json()); // Body ko parse karne ke liye

// --- Routes ko import karein ---
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journals'); // FIX: 'journals' ko 'journal' kiya
const studyTaskRoutes = require('./routes/studyTask');
const focusSessionRoutes = require('./routes/focusSession');
const groupRoutes = require('./routes/group');
const chatRoutes = require('./routes/chat');

// --- Routes ko use karein ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/journal', journalRoutes);
app.use('/api/v1/tasks', studyTaskRoutes);
app.use('/api/v1/focus', focusSessionRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/chat', chatRoutes);


app.get('/', (req, res) => res.send('Backend server chal raha hai!'));

app.listen(PORT, () => console.log(`Server ${PORT} par daud raha hai`));

