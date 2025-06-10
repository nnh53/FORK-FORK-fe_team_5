import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, Button, Dialog, Snackbar } from '@mui/material';
import { useState } from 'react';
import type { Movie, MovieFormData } from '../../../interfaces/movies.interface';
import MovieDetail from './MovieDetail';
import MovieList from './MovieList';

const MovieManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCreate = () => {
    setSelectedMovie(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(undefined);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (values: MovieFormData) => {
    try {
      if (selectedMovie) {
        // Update existing movie
        await fetch(`http://localhost:3000/movies/${selectedMovie.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        showSnackbar('Movie updated successfully', 'success');
      } else {
        // Create new movie
        await fetch('http://localhost:3000/movies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        showSnackbar('Movie created successfully', 'success');
      }
      setIsModalOpen(false);
      setSelectedMovie(undefined);
    } catch (error) {
      console.error('Error saving movie:', error);
      showSnackbar('Failed to save movie', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Movie
        </Button>
      </Box>

      <MovieList onEdit={handleEdit} />

      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <MovieDetail movie={selectedMovie} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieManagement;
