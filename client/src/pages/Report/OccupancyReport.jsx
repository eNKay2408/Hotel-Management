import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	ResponsiveContainer,
} from "recharts";
import html2pdf from "html2pdf.js";

import { Title, Button, Table } from "../../components";
import { getOccupancy } from "../../services";

const OccupancyReport = () => {
	const { id } = useParams();

	/*
	* Get occupancy report data from API
	* API: GET /reports/occupancy/:id
	const [occupancy, setOccupancy] = useState({});

	useEffect(() => {
		const fetchOccupancy = async () => {
			const data = await getOccupancy(id);
			setOccupancy(data);
		};

		fetchOccupancy();
	}, []);
	*/

	const [occupancy, setOccupancy] = useState({
		month: 10,
		year: 2024,
		rooms: [
			{
				number: 100,
				rentalDays: 20,
				rate: 0.2,
			},
			{
				number: 101,
				rentalDays: 10,
				rate: 0.1,
			},
			{
				number: 201,
				rentalDays: 20,
				rate: 0.2,
			},
			{
				number: 202,
				rentalDays: 30,
				rate: 0.3,
			},
			{
				number: 301,
				rentalDays: 10,
				rate: 0.1,
			},
			{
				number: 302,
				rentalDays: 10,
				rate: 0.1,
			},
		],
	});

	const data = occupancy.rooms.map((room) => ({
		roomNumber: room.number,
		rentalDays: room.rentalDays,
	}));

	const header = ["Number", "Rental Days", "Percent"];

	const body = occupancy.rooms.map((room) => [
		room.number,
		room.rentalDays,
		`${(room.rate * 100).toFixed(0)}%`,
	]);

	const reportRef = useRef();

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		const opt = {
			filename: `occupancy_${occupancy.month}_${occupancy.year}.pdf`,
		};

		html2pdf().from(reportRef.current).set(opt).save();
	};

	return (
		<div className="flex flex-col w-full py-4 px-2" ref={reportRef}>
			<Title title={`Occupancy - ${occupancy.month}/${occupancy.year}`} />

			<div className="flex justify-center font-play md:text-lg text-md md:w-[80%] w-full mx-auto">
				<ResponsiveContainer height={400}>
					<BarChart data={data} barCategoryGap="30%">
						<CartesianGrid />
						<XAxis
							dataKey="roomNumber"
							label={{
								value: "Room Number",
								position: "insideBottom",
								offset: -5,
							}}
						/>
						<YAxis
							label={{
								value: "Rental Days",
								angle: -90,
								position: "insideLeft",
							}}
						/>
						<Tooltip />
						<Bar dataKey="rentalDays" fill="#bf4842" />
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="mx-auto md:w-[80%] w-[100%] bg-white mt-10">
				<Table header={header} body={body} color="yellow" />
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
	);
};

export default OccupancyReport;
