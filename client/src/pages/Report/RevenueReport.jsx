import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import html2pdf from 'html2pdf.js';

import { Title, Table, Button } from '../../components';
import { getRevenue } from '../../services';

const RevenueReport = () => {
  const { id } = useParams();

  /*
	* Get revenue report data from API
	* API: GET /reports/revenue/:id
	const [revenue, setRevenue] = useState({});

	useEffect(() => {
		const fetchRevenue = async () => {
			const data = await getRevenue(id);
			setRevenue(data);
		};

		fetchRevenue();
	}, []);
	*/

  const [revenue, setRevenue] = useState({
    month: 10,
    year: 2024,
    roomTypes: [
      {
        type: 'A',
        revenue: 20000,
        rate: 0.2,
      },
      {
        type: 'B',
        revenue: 30000,
        rate: 0.3,
      },
      {
        type: 'C',
        revenue: 50000,
        rate: 0.5,
      },
    ],
  });

  const totalRevenue = revenue.roomTypes.reduce(
    (sum, room) => sum + room.revenue,
    0
  );

  const formatMoney = (number) => {
    return '$' + new Intl.NumberFormat('en-US').format(number);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00FF00'];

  const renderLabel = (entry) => `${(entry.rate * 100).toFixed(0)}%`;

  const pieProps = {
    data: revenue.roomTypes,
    innerRadius: 80,
    paddingAngle: 2,
    dataKey: 'revenue',
  };

  const tooltipFormatter = (value, name, props) => {
    const type = 'Type ' + props.payload.type;
    return [formatMoney(value), type];
  };

  const legendFormatter = (value, entry) => {
    const type = 'Type ' + entry.payload.type;
    return [type];
  };

  const header = ['Type', 'Revenue', 'Percent'];

  const body = revenue.roomTypes.map((room) => [
    room.type,
    formatMoney(room.revenue),
    (room.rate * 100).toFixed(0) + '%',
  ]);

  const reportRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const opt = {
      filename: `revenue_${revenue.month}_${revenue.year}.pdf`,
    };

    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <div
      className="flex flex-col w-full py-4 px-2 min-h-[351px]"
      ref={reportRef}
    >
      <div className="flex flex-col">
        <Title title={`Revenue - ${revenue.month}/${revenue.year}`} />

        <div className="flex md:flex-row flex-col gap-2 items-center justify-center bg-zinc-200 rounded-lg p-2 lg:w-[80%] w-full mx-auto font-play">
          <div className="flex-[2] w-full">
            <ResponsiveContainer height={300}>
              <PieChart>
                <Legend formatter={legendFormatter} />

                <Pie {...pieProps} label={renderLabel}>
                  {revenue.roomTypes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip formatter={tooltipFormatter} />

                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  className="text-xl fill-red"
                >
                  <tspan x="50%" dy="-20px">
                    Total Revenue:
                  </tspan>
                  <tspan x="50%" dy="1.2em" className="font-bold">
                    {formatMoney(totalRevenue)}
                  </tspan>
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-[3] w-full max-w-[800px] mx-4 bg-white">
            <Table header={header} body={body} color="red" />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            color="green"
            text="Export PDF"
            onClick={() => handleDownload()}
          />
          <Button
            color="orange"
            text="Print Report"
            onClick={() => handlePrint()}
          />
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
