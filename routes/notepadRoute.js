const {status, getNotes, addNotes, editNotes, deleteNotes, login, refreshToken} = require('../controllers/notepadController');
const authMiddleware = require('../middlewares/authMiddleware');


const Notepad_router = require('express').Router();

Notepad_router.get('/status', status);

Notepad_router.get('/getNotes', getNotes);

Notepad_router.post('/addNotes', addNotes);

Notepad_router.post('/editNotes/:id', editNotes);

Notepad_router.get('/deleteNotes/:id', deleteNotes);

Notepad_router.post('/auth', login);

Notepad_router.post('/refresh-token', refreshToken);


// Notepad_router.use(authMiddleware);




module.exports = Notepad_router;