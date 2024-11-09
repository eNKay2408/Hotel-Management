const Table = ({ header, body, color }) => {
	return (
		<table className="table-auto text-center w-full">
			<thead className="table-header-group md:text-xl text-lg">
				<tr className="table-row">
					<th
						key="No"
						className={`table-cell border h-12 ${
							color === "red" ? "bg-red" : `bg-${color}`
						} px-1`}
					>
						No
					</th>
					{header.map((title, index) => (
						<th
							key={index}
							className={`table-cell border ${
								color === "red" ? "bg-red" : `bg-${color}`
							} px-1`}
						>
							{title}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="md:text-lg text-md">
				{body.map((row, index) => (
					<tr key={index}>
						<td className="border px-1">{index + 1}</td>
						{row.map((cell, index) => (
							<td key={index} className="border px-1">
								{cell}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
