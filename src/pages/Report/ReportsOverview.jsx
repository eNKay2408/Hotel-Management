import { useState, useEffect } from 'react';

import { Title, Button } from '../../components';
import { getReports } from '../../services';

const ReportOverview = () => {
  const [reports, setReports] = useState([
    {
      Month: 9,
      Year: 2024,
      TotalRevenue: 1000,
      TotalRentalDay: 50,
    },
    {
      Month: 10,
      Year: 2024,
      TotalRevenue: 2000,
      TotalRentalDay: 70,
    },
    {
      Month: 9,
      Year: 2024,
      TotalRevenue: 1000,
      TotalRentalDay: 50,
    },
    {
      Month: 10,
      Year: 2024,
      TotalRevenue: 2000,
      TotalRentalDay: 70,
    },
  ]);

  /*
	useEffect(() => {
		const fetchReports = async () => {
			const data = await getReports();
			setReports(data);
		};
		fetchReports();
	}, []);
	*/
  const formatMoney = (number) => {
    return '$' + new Intl.NumberFormat('en-US').format(number);
  };

  const handleRevenue = () => {
    window.location.href = '/reports/revenue?month=10&year=2024';
  };

  const handleOccupancy = () => {
    window.location.href = '/reports/occupancy?month=10&year=2024';
  };

  return (
    <div className="flex flex-col w-full py-4 px-2 min-h-80">
      <Title title="Reports Overview " />

      <div className="lg:w-[70%] w-full mx-auto overflow-x-auto">
        <table className="table-auto text-center w-full">
          <thead className="table-header-group md:text-xl text-lg font-play text-zinc-100">
            <tr className="table-row">
              <th className="border bg-red md:h-12 h-10 px-2">No</th>
              <th className="border bg-red px-2 w-2/12">Month</th>
              <th className="border bg-red px-2">Total Revenue</th>
              <th className="border bg-red px-2">Total Rental Day</th>
              <th className="border bg-red px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="md:text-lg text-base font-amethysta">
            {reports.map((invoice, index) => (
              <tr key={index}>
                <td className="border py-2 border-gray">{index + 1}</td>
                <td className="border py-2 border-gray">
                  {invoice.Month} / {invoice.Year}
                </td>
                <td className="border py-2 border-gray">
                  {formatMoney(invoice.TotalRevenue)}
                </td>
                <td className="border py-2 border-gray">
                  {invoice.TotalRentalDay + ' days'}
                </td>
                <td className="border p-2 border-gray">
                  <div className="flex justify-center gap-2">
                    <Button
                      color="green"
                      text="Revenue"
                      onClick={() => handleRevenue()}
                    />
                    <Button
                      color="orange"
                      text="Occupancy"
                      onClick={() => handleOccupancy()}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportOverview;
