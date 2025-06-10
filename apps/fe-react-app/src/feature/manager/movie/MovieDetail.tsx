import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { Movie, MovieFormData } from '../../../interfaces/movies.interface';

interface MovieDetailProps {
  movie?: Movie;
  onSubmit: (values: MovieFormData) => void;
  onCancel: () => void;
}

const MovieDetail = ({ movie, onSubmit, onCancel }: MovieDetailProps) => {
  const { control, handleSubmit, reset } = useForm<MovieFormData>({
    defaultValues: {
      title: '',
      genre: '',
      director: '',
      releaseYear: new Date().getFullYear(),
      duration: 90,
      rating: 5,
      description: '',
      poster: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (movie) {
      reset(movie);
    }
  }, [movie, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState: { error } }) => <TextField {...field} label="Title" error={!!error} helperText={error?.message} fullWidth />}
        />

        <Controller
          name="genre"
          control={control}
          rules={{ required: 'Genre is required' }}
          render={({ field, fieldState: { error } }) => <TextField {...field} label="Genre" error={!!error} helperText={error?.message} fullWidth />}
        />

        <Controller
          name="director"
          control={control}
          rules={{ required: 'Director is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Director" error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="releaseYear"
          control={control}
          rules={{
            required: 'Release year is required',
            min: {
              value: 1900,
              message: 'Year must be 1900 or later',
            },
            max: {
              value: 2100,
              message: 'Year must be 2100 or earlier',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} type="number" label="Release Year" error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="duration"
          control={control}
          rules={{
            required: 'Duration is required',
            min: {
              value: 1,
              message: 'Duration must be at least 1 minute',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} type="number" label="Duration (minutes)" error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="rating"
          control={control}
          rules={{
            required: 'Rating is required',
            min: {
              value: 1,
              message: 'Rating must be between 1 and 10',
            },
            max: {
              value: 10,
              message: 'Rating must be between 1 and 10',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} type="number" label="Rating" inputProps={{ step: 0.1 }} error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Description" multiline rows={4} error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="poster"
          control={control}
          rules={{ required: 'Poster URL is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} label="Poster URL" error={!!error} helperText={error?.message} fullWidth />
          )}
        />

        <Controller
          name="status"
          control={control}
          rules={{ required: 'Status is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField {...field} select label="Status" error={!!error} helperText={error?.message} fullWidth>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          )}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {movie ? 'Update' : 'Create'} Movie
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MovieDetail;
