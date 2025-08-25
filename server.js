const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

app.get('/voting', (req, res) => {
    res.sendFile(path.join(__dirname, 'voting.html'));
});

// Serve the login page at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let users = []; // This will be replaced with database integration
let votedUsers = new Set(); // To track users who have already voted

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password and add new user
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    console.log('New user registered:', username);
    res.json({ success: true, message: 'Registration successful' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.username = username; // Store username in session
        console.log('Login successful for:', username);
        return res.json({ success: true, message: 'Login successful' });
    } else {
        console.log('Login failed for:', username);
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Vote endpoint
app.post('/api/vote', (req, res) => {
    const { username, candidateId } = req.body;
    
    if (votedUsers.has(username)) {
        return res.status(400).json({ success: false, message: 'You have already voted' });
    }

    // Ensure the user is logged in before voting
    if (!req.session.username) {
        return res.status(403).json({ success: false, message: 'User not logged in' });
    }

    if (!candidateId || candidateId < 1 || candidateId > 3) {
        return res.status(400).json({ success: false, message: 'Invalid candidate selection' });
    }

    votes.push({ username, candidateId });
    votedUsers.add(username);
    
    res.json({ success: true, message: 'Vote recorded successfully' });
});

// Get results endpoint
app.get('/api/results', (req, res) => {
    const results = {
        candidate1: votes.filter(v => v.candidateId === 1).length,
        candidate2: votes.filter(v => v.candidateId === 2).length,
        candidate3: votes.filter(v => v.candidateId === 3).length
    };
    
    res.json({ success: true, results });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
