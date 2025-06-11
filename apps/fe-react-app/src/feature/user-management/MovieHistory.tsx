import { useState, useEffect } from 'react';
import { CustomTable, type TableColumns } from './components/Table';
import type { MovieHistory } from '../../interfaces/movies.interface';
import { formatMovieSlot } from '../../utils/validation.utils';

export const MyMovieHistory: React.FC = () => {
  const tableColumns: TableColumns[] = [
    {
      header: 'Mã hóa đơn',
      accessorKey: 'receiptId',
      width: 'w-[15%]',
    },
    {
      header: 'Phim',
      accessorKey: 'movieName',
      width: 'w-[20%]',
    },
    {
      header: 'Rạp Chiếu',
      accessorKey: 'room',
    },
    {
      header: 'Suất chiếu',
      accessorKey: 'movieSlot',
    },
    {
      header: 'Ghế đã đặt',
      accessorKey: 'seats',
    },
    {
      header: 'Ngày đặt',
      accessorKey: 'usedPoints',
    },
    {
      header: 'Điểm',
      accessorKey: 'availablePoints',
    },
  ];

  const [tableData, setTableData] = useState<MovieHistory[]>([]);
  const [errors, setError] = useState<string | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('http://localhost:3000/myMovieHistory');
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MovieHistory[] = await response.json();
        const formattedData: MovieHistory[] = data.map((movie) => ({
          ...movie,
          movieSlot: formatMovieSlot(movie.movieSlot),
        }));

        setTableData(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching user profile:', err);
      }
    };
    getData();
  }, []);
  if (!tableData) {
    return <div>Loading profile...</div>;
  }
  return (
    <>
      {errors && <p className="text-red-500">{errors}</p>}
      <CustomTable tableColumns={tableColumns} tableData={tableData} />{' '}
    </>
  );
};
