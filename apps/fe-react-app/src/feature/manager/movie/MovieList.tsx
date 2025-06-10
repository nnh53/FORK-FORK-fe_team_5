import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Movie } from '../../../interfaces/movies.interface';

interface MovieListProps {
  onEdit: (movie: Movie) => void;
}

const MovieList = ({ onEdit }: MovieListProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Movie>('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSort = (property: keyof Movie) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      try {
        await fetch(`http://localhost:3000/movies/${movieToDelete.id}`, {
          method: 'DELETE',
        });
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  const sortedMovies = [...movies].sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    } else {
      return b[orderBy] > a[orderBy] ? 1 : -1;
    }
  });

  const paginatedMovies = sortedMovies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={orderBy === 'title'} direction={orderBy === 'title' ? order : 'asc'} onClick={() => handleSort('title')}>
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Director</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'releaseYear'}
                  direction={orderBy === 'releaseYear' ? order : 'asc'}
                  onClick={() => handleSort('releaseYear')}
                >
                  Release Year
                </TableSortLabel>
              </TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === 'rating'} direction={orderBy === 'rating' ? order : 'asc'} onClick={() => handleSort('rating')}>
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              paginatedMovies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.director}</TableCell>
                  <TableCell>{movie.releaseYear}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>
                    <Chip label={movie.rating.toFixed(1)} color={movie.rating >= 8 ? 'success' : movie.rating >= 6 ? 'warning' : 'error'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={movie.status.toUpperCase()} color={movie.status === 'active' ? 'success' : 'error'} />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => onEdit(movie)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(movie)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={movies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>Are you sure you want to delete this movie? This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MovieList;
