import React from 'react'
import CircularGallery from '../../../components/Reactbits/reactbit-components/CircularGallery/CircularGallery'

const MovieGallery = () => {
  // Random movie-themed images for testing the animation
  const movieImages = [
    {
      image: 'https://picsum.photos/seed/movie1/800/600',
      text: 'Action Hero'
    },
    {
      image: 'https://picsum.photos/seed/movie2/800/600',
      text: 'Romance'
    },
    {
      image: 'https://picsum.photos/seed/movie3/800/600',
      text: 'Thriller'
    },
    {
      image: 'https://picsum.photos/seed/movie4/800/600',
      text: 'Comedy'
    },
    {
      image: 'https://picsum.photos/seed/movie5/800/600',
      text: 'Drama'
    },
    {
      image: 'https://picsum.photos/seed/movie6/800/600',
      text: 'Sci-Fi'
    },
    {
      image: 'https://picsum.photos/seed/movie7/800/600',
      text: 'Horror'
    },
    {
      image: 'https://picsum.photos/seed/movie8/800/600',
      text: 'Adventure'
    },
    {
      image: 'https://picsum.photos/seed/movie9/800/600',
      text: 'Fantasy'
    },
    {
      image: 'https://picsum.photos/seed/movie10/800/600',
      text: 'Mystery'
    }
  ];

  return (
    <div style={{ height: '600px', position: 'relative', background: '#000' }}>
      <CircularGallery 
        items={movieImages}
        bend={3} 
        textColor="#ffffff" 
        borderRadius={0.05} 
      />
    </div>
  )
}

export default MovieGallery
