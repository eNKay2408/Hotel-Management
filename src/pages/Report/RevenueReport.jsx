import { useEffect, useState, useRef } from 'react';
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
  const query = new URLSearchParams(window.location.search);
  const month = query.get('month');
  const year = query.get('year');

  const [revenue, setRevenue] = useState({
    TotalRevenue: 1000,
    Details: [
      {
        Type: 'A',
        Revenue: 300,
      },
      {
        Type: 'B',
        Revenue: 500,
      },
      {
        Type: 'C',
        Revenue: 200,
      },
    ],
  });

  /*
	* Get revenue report data from API
	* API: GET /reports/revenue/:id

	useEffect(() => {
		const fetchRevenue = async () => {
			const data = await getRevenue(month, year);
			setRevenue(data);
		};

		fetchRevenue();
	}, []);
	*/

  const formatMoney = (number) => {
    return '$' + new Intl.NumberFormat('en-US').format(number);
  };

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FF8042',
    '#e3b41b',
    '#15cf15',
    '#FF00FF',
  ];

  const renderLabel = (entry) =>
    ((entry.Revenue / revenue.TotalRevenue) * 100).toFixed(1) + '%';

  const pieProps = {
    data: revenue.Details,
    innerRadius: 80,
    paddingAngle: 2,
    dataKey: 'Revenue',
  };

  const tooltipFormatter = (value, name, props) => {
    const type = 'Type ' + props.payload.Type;
    return [formatMoney(value), type];
  };

  const legendFormatter = (value, entry) => {
    const type = 'Type ' + entry.payload.Type;
    return [type];
  };

  const header = ['Type', 'Revenue', 'Percent'];

  const body = revenue.Details.map((detail) => {
    const percent = (detail.Revenue / revenue.TotalRevenue) * 100;

    return [
      `Type ${detail.Type}`,
      formatMoney(detail.Revenue),
      `${percent.toFixed(1)}%`,
    ];
  });

  const reportRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const opt = {
      filename: `revenue_${month}_${year}.pdf`,
    };

    html2pdf().from(reportRef.current).set(opt).save();
  };

  return (
    <div className="flex flex-col w-full py-4 px-2" ref={reportRef}>
      <div className="flex flex-col">
        <Title title={`Revenue Report - ${month}/${year}`} />

        <div className="flex md:flex-row flex-col gap-2 items-center justify-center bg-zinc-200 rounded-lg p-2 lg:w-[80%] w-full mx-auto font-play py-5">
          <div className="flex-[2] w-full">
            <ResponsiveContainer height={300}>
              <PieChart>
                <Legend formatter={legendFormatter} />

                <Pie {...pieProps} label={renderLabel}>
                  {revenue.Details.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip formatter={tooltipFormatter} />

                <text x="50%" y="50%" textAnchor="middle" className="text-xl">
                  <tspan x="50%" dy="-20px">
                    Total Revenue:
                  </tspan>
                  <tspan x="50%" dy="1.2em" className="font-bold">
                    {formatMoney(revenue.TotalRevenue)}
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
