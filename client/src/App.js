import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material.Edit';  // Fixed the incorrect path
import axios from 'axios';

// Thay đổi cách lấy API_URL
const API_URL = 'https://note-app-backend.onrender.com';  // URL backend thực tế trên Render

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/notes/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/api/notes`, { title, content });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id); // Changed from note.id to note._id
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Add these colors
  const colors = {
    lightBlue: '#e3f2fd',  // Light blue color
    lightPink: '#fce4ec'   // Light pink color
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, color: '#2196f3' }}>
          Note Manager
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {editingId ? 'Update Note' : 'Add Note'}
          </Button>
        </Box>

        <List>
          {notes.map((note, index) => (
            <ListItem 
              key={note._id} 
              sx={{ 
                bgcolor: index % 2 === 0 ? colors.lightBlue : colors.lightPink,
                mb: 1, 
                borderRadius: 1,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: 1
                }
              }}
            >
              <ListItemText
                primary={<Typography variant="h6">{note.title}</Typography>}
                secondary={
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {note.content}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  onClick={() => handleEdit(note)}
                  sx={{ color: '#2196f3' }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  edge="end" 
                  onClick={() => handleDelete(note._id)}
                  sx={{ color: '#f50057' }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
