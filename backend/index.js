// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 8001;

// // Middlewares
// app.use(cors());
// app.use(express.json()); // Body ko parse karne ke liye

// // Routes ko import karein
// const authRoutes = require('./routes/auth');
// // Aapke future routes
// // const studyBlocksRoute = require('./routes/studyBlocks'); 
// // const focusSessionsRoute = require('./routes/focusSessions');

// // Routes ko use karein
// app.use('/api/v1/auth', authRoutes);
// // app.use('/api/v1/study-blocks', studyBlocksRoute);
// // app.use('/api/v1/focus-sessions', focusSessionsRoute);


// app.get('/', (req, res) => res.send('Backend server chal raha hai!'));

// app.listen(PORT, () => console.log(`Server ${PORT} par daud raha hai`));









// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 8001;

// // Middlewares
// app.use(cors());
// app.use(express.json()); // Body ko parse karne ke liye

// // Routes ko import karein
// const authRoutes = require('./routes/auth');
// const journalRoutes = require('./routes/journals'); // <-- Yeh line add ki gayi hai
// // Aapke future routes
// // const studyBlocksRoute = require('./routes/studyBlocks'); 
// // const focusSessionsRoute = require('./routes/focusSessions');

// // Routes ko use karein
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/journal', journalRoutes); // <-- Yeh line add ki gayi hai
// // app.use('/api/v1/study-blocks', studyBlocksRoute);
// // app.use('/api/v1/focus-sessions', focusSessionsRoute);


// app.get('/', (req, res) => res.send('Backend server chal raha hai!'));

// app.listen(PORT, () => console.log(`Server ${PORT} par daud raha hai`));





require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8001;

// Middlewares
app.use(cors());
app.use(express.json()); // Body ko parse karne ke liye

// Routes ko import karein
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journals'); // <-- FIX: 'journals' ko 'journal' kiya
const studyTaskRoutes = require('./routes/studyTask'); // <-- YEH LINE ADD KI GAYI HAI

// Aapke future routes
// const studyBlocksRoute = require('./routes/studyBlocks'); 
// const focusSessionsRoute = require('./routes/focusSessions');

// Routes ko use karein
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/journal', journalRoutes);
app.use('/api/v1/tasks', studyTaskRoutes); // <-- YEH LINE ADD KI GAYI HAI

// app.use('/api/v1/study-blocks', studyBlocksRoute);
// app.use('/api/v1/focus-sessions', focusSessionsRoute);


app.get('/', (req, res) => res.send('Backend server chal raha hai!'));

app.listen(PORT, () => console.log(`Server ${PORT} par daud raha hai`));

