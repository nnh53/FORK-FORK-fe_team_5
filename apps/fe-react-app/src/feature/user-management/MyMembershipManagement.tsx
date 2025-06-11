import { useState, useEffect } from 'react';
import type { MyMembershipData } from '../../interfaces/users.interface';
import { CustomTable, type TableColumns } from './components/Table';

export const MyMembership: React.FC = () => {
  const tableColumns: TableColumns[] = [
    {
      header: 'Số thẻ',
      accessorKey: 'cardNumber',
      width: 'w-[15%]',
    },
    {
      header: 'Hạng thẻ',
      accessorKey: 'tier',
      width: 'w-[15%]',
    },
    {
      header: 'Ngày kích hoạt',
      accessorKey: 'activationDate',
      width: 'w-[12%]',
    },
    {
      header: 'Tổng chi tiêu',
      accessorKey: 'totalSpent',
      width: 'w-[12%]',
    },
    {
      header: 'Điểm tích lũy',
      accessorKey: 'accumulatePoints',
    },
    {
      header: 'Điểm đã tiêu',
      accessorKey: 'usedPoints',
    },
    {
      header: 'Điểm khả dụng',
      accessorKey: 'availablePoints',
    },
    {
      header: 'Điểm sắp hết hạn',
      accessorKey: 'nearExpiringPoints',
    },
    {
      header: 'Ngày hết hạn',
      accessorKey: 'expiredDate',
    },
  ];

  const [tableData, setTableData] = useState<MyMembershipData[]>([]);
  const [errors, setError] = useState<string | null>(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('http://localhost:3000/myMembership');
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        const data: MyMembershipData[] = await response.json();
        setTableData(data);
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
