const Table = ({ header, body, color }) => {
  return (
    <table className="table-auto text-center w-full font-play">
      <thead className="table-header-group md:text-xl text-lg">
        <tr className="table-row">
          <th
            key="No"
            className={`table-cell border h-12 ${
              color === 'red' ? 'bg-red' : 'bg-black'
            } px-2 text-white`}
          >
            No
          </th>
          {header.map((title, index) => (
            <th
              key={index}
              className={`table-cell border ${
                color === 'red' ? 'bg-red' : 'bg-black'
              } px-2 text-white`}
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="md:text-xl text-lg">
        {body.map((row, index) => (
          <tr key={index}>
            <td className="border px-1 py-2">{index + 1}</td>
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
