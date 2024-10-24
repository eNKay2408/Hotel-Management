const Table = ({ header, body, color }) => {
	return (
		<table className="table-auto text-center w-full">
			<thead className="table-header-group text-xl">
				<tr className="table-row">
					<th key="No" className={`table-cell border h-12 bg-${color}`}>
						No
					</th>
					{header.map((title, index) => (
						<th key={index} className={`table-cell border bg-${color}`}>
							{title}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="text-lg">
				{body.map((row, index) => (
					<tr key={index}>
						<td className="border">{index + 1}</td>
						{row.map((cell, index) => (
							<td key={index} className="border">
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
