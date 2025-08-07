const jwt = require('jsonwebtoken');
const connection = require('../helpers/db');

const JWT_SECRET = process.env.JWT_SECRET || '98vyt3n9v38v4nt3n9tv930nt4v3nt9p3 m eg eomlgecg,oqmrglhewohm';

const getNotes = (req, res) => {
  connection.query("SELECT * FROM notes ORDER BY time DESC", (error, results) => {
    if (error) {
      console.error("Error fetching notes: " + error.stack);
      return res.status(500).send("Error fetching notes");
    }
    res.json(results);
  });
};

const addNotes = (req, res) => {
  const { title, note, priority, reminder } = req.body;
  
  if (!title || !note) {
    return res.status(400).send("Title and note content are required");
  }

  const newNote = {
    title,
    note,
    priority: priority || 'low',
    time: new Date(),
    reminder: reminder || 0,
    status: 'active'
  };

  connection.query("INSERT INTO notes SET ?", newNote, (error, results) => {
    if (error) {
      console.error("Error adding note: " + error.stack);
      return res.status(500).send("Error adding note");
    }
    res.status(201).json({
      message: "Note added successfully",
      noteId: results.insertId
    });
  });
};

const editNotes = (req, res) => {
  const { id } = req.params;
  const { title, note, priority, reminder, status } = req.body;

  if (!title || !note) {
    return res.status(400).send("Title and note content are required");
  }
  console.log(id, title, note, priority, reminder, status);
  const updatedNote = {
    title,
    note,
    priority: priority || 'low',
    time: new Date(),
    reminder: reminder || null,
    status: status || 'active'
  };

  connection.query(
    "UPDATE notes SET ? WHERE id = ?",
    [updatedNote, id],
    (error, results) => {
      if (error) {
        console.error("Error updating note: " + error.stack);
        return res.status(500).send("Error updating note");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Note not found");
      }
      res.json({ message: "Note updated successfully" });
    }
  );
};

const deleteNotes = (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM notes WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error deleting note: " + error.stack);
        return res.status(500).send("Error deleting note");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Note not found");
      }
      res.json({ message: "Note deleted successfully" });
    }
  );
};


const status = (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT status FROM settings", 
    (error, results) => {
      if (error) {
        console.error("Error deleting note: " + error.stack);
        return res.status(500).send("Error deleting note");
      }
      if (results.status == 0) {
        return res.send("Server is Down Now!!");
      }
      res.json({ message: "Server is Active Now!!" });
    }
  );
};


const storeToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // Check if token already exists
  connection.query(
    'SELECT * FROM auth_tokens WHERE token = ?',
    [token],
    (error, results) => {
      if (error) {
        console.error('Token check error:', error);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        // Update existing token
        connection.query(
          'UPDATE auth_tokens SET last_used = NOW(), is_active = TRUE WHERE token = ?',
          [token],
          (error) => {
            if (error) {
              console.error('Token update error:', error);
              return res.status(500).json({ message: 'Error updating token' });
            }
            res.json({ message: 'Token refreshed successfully' });
          }
        );
      } else {
        // Store new token
        connection.query(
          'INSERT INTO auth_tokens (token, last_used) VALUES (?, NOW())',
          [token],
          (error) => {
            if (error) {
              console.error('Token storage error:', error);
              return res.status(500).json({ message: 'Error storing token' });
            }
            res.json({ message: 'Token stored successfully' });
          }
        );
      }
    }
  );
};

const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  connection.query(
    'UPDATE auth_tokens SET last_used = NOW() WHERE token = ? AND is_active = TRUE',
    [token],
    (error, results) => {
      if (error) {
        console.error('Token refresh error:', error);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(401).json({ message: 'Invalid or inactive token' });
      }

      res.json({ message: 'Token refreshed successfully' });
    }
  );
};

const login = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    connection.query(
      'SELECT * FROM auth_tokens WHERE token = ? AND is_active = TRUE',
      [token],
      (error, results) => {
        if (error) {
          console.error('Login error:', error);
          return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid or inactive token' });
        }

        // Update last used timestamp
        connection.query(
          'UPDATE auth_tokens SET last_used = NOW() WHERE id = ?',
          [results[0].id]
        );

        // Generate JWT with shorter expiry
        const accessToken = jwt.sign(
          { 
            token: token,
            tokenId: results[0].id
          },
          JWT_SECRET,
          { expiresIn: '1h' } // Shorter expiry to encourage refresh
        );

        res.json({
          message: 'Login successful',
          accessToken,
          expiresIn: '1h'
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




module.exports = {
  status,
  getNotes,
  addNotes,
  editNotes,
  deleteNotes,
  login,
  refreshToken,
  storeToken
};