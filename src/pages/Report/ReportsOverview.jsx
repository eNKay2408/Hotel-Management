import { Title, Button } from "../../components";
import { getReports } from "../../services";

const ReportOverview = () => {
	/*
	* Get the reports data from the API
	* API: GET /api/reports
	const [reports, setReports] = useState();

	useEffect(() => {
		const fetchReports = async () => {
			const data = await getReports();
			setReports(data);
		};
		fetchReports();
	}, []);
	*/

	const handleRevenue = () => {
		window.location.href = "/reports/revenue/10";
	};

	const handleOccupancy = () => {
		window.location.href = "/reports/occupancy/10";
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Reports Overview " />
			<Button
				color="green"
				text="Revenue Report"
				onClick={() => handleRevenue()}
			/>
			<br />
			<Button
				color="red"
				text="Occupancy Report"
				onClick={() => handleOccupancy()}
			/>

			<div className="h-[220px]"></div>
		</div>
	);
};

export default ReportOverview;
