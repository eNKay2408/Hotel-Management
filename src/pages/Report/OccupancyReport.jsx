import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import html2pdf from 'html2pdf.js';

import { Title, Button, Table } from '../../components';
import { getOccupancy } from '../../services';

const OccupancyReport = () => {
  const query = new URLSearchParams(window.location.search);
  const month = query.get('month');
  const year = query.get('year');

  const [occupancy, setOccupancy] = useState({
    TotalRentalDays: 75,
    Details: [
      {
        Room: '101',
        RentalDays: 10,
      },
      {
        Room: '102',
        RentalDays: 25,
      },
      {
        Room: '103',
        RentalDays: 15,
      },
      {
        Room: '101',
        RentalDays: 10,
      },
      {
        Room: '102',
        RentalDays: 25,
      },
    ],
  });
  /*
	* Get occupancy report data from API
	* API: GET /reports/occupancy/:id

	useEffect(() => {
		const fetchOccupancy = async () => {
			const data = await getOccupancy(month, year);
			setOccupancy(data);
		};

		fetchOccupancy();
	}, []);
	*/

  const data = occupancy.Details.map((detail) => ({
    roomNumber: detail.Room,
    rentalDays: detail.RentalDays,
    percent: ((detail.RentalDays / occupancy.TotalRentalDays) * 100).toFixed(1),
  }));

  const header = ['Number', 'Rental Days', 'Percent'];

  const body = occupancy.Details.map((detail) => [
    detail.Room,
    detail.RentalDays,
    `${((detail.RentalDays / occupancy.TotalRentalDays) * 100).toFixed(1)}%`,
  ]);

  const reportRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const opt = {
      filename: `occupancy_${month}_${year}.pdf`,
    };

    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <div className="flex flex-col w-full py-4 px-2" ref={reportRef}>
      <Title title={`Occupancy Report - ${month}/${year}`} />

      <div className="flex justify-center font-play md:text-lg text-md md:w-[80%] w-full mx-auto">
        <ResponsiveContainer height={400}>
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid />
            <XAxis
              dataKey="roomNumber"
              label={{
                value: 'Room Number',
                position: 'insideBottom',
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: 'Rental Days',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Bar dataKey="rentalDays" fill="#bf4842" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mx-auto md:w-[70%] w-[100%] bg-white mt-10">
        <Table header={header} body={body} color="green" />
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          color="orange"
          text="Export PDF"
          onClick={() => handleDownload()}
        />
        <Button color="red" text="Print Report" onClick={() => handlePrint()} />
      </div>
    </div>
  );
};

export default OccupancyReport;
