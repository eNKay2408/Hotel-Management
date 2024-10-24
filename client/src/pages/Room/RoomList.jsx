import { useState, useEffect } from "react";

import { redirect } from "react-router-dom";
import { Title, Button } from "../../components";

import { getRooms, deleteRoom } from "../../services";

const RoomList = () => {
	/*
	* Get rooms data from API
	* API: GET /api/room

	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		const loadRooms = async () => {
			const data = await getRooms();
			setRooms(data);
		};
		loadRooms();
	}, []);
	*/

	const [rooms, setRooms] = useState([
		{
			id: 1,
			number: 101,
			area: 500,
			type: "A",
			quantity: 3,
			rate: 299,
		},
		{
			id: 2,
			number: 102,
			area: 800,
			type: "B",
			quantity: 2,
			rate: 199,
		},
		{
			id: 3,
			number: 103,
			area: 600,
			type: "C",
			quantity: 1,
			rate: 99,
		},
		{
			id: 4,
			number: 104,
			area: 900,
			type: "D",
			quantity: 4,
			rate: 399,
		},
	]);

	const handleEditRoom = (id) => {
		window.location.href = `/rooms/${id}`;
	};

	const handleDeleteRoom = async (id, number) => {
		if (!window.confirm(`Are you sure you want to delete Room ${number}?`)) {
			return;
		}

		setRooms(rooms.filter((room) => room.id !== id));

		// TODO: Delete room from API
		/*
		try {
			await deleteRoom(id);

			setRooms(rooms.filter((room) => room.id !== id));
		} catch (error) {
			console.error(error);
			alert("Failed to delete room");
		}
		*/
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Room List" />

			<div className="w-full max-w-[800px] mx-auto">
				<table className="table-auto text-center w-full">
					<thead className="table-header-group text-xl">
						<tr className="table-row">
							<th className="border bg-zinc-200 h-12">No</th>
							<th className="border bg-zinc-200">Number</th>
							<th className="border bg-zinc-200">Area</th>
							<th className="border bg-zinc-200">Type</th>
							<th className="border bg-zinc-200">Quantity</th>
							<th className="border bg-zinc-200">Rate</th>
							<th className="border bg-zinc-200">Actions</th>
						</tr>
					</thead>
					<tbody className="text-lg">
						{rooms.map((room, index) => (
							<tr key={index}>
								<td className="border">{index + 1}</td>
								<td className="border">{room.number}</td>
								<td className="border">
									{room.area} m<sup>2</sup>
								</td>
								<td className="border">{room.type}</td>
								<td className="border">
									{room.quantity} {room.quantity > 1 ? "guests" : "guest"}
								</td>
								<td className="border">${room.rate}</td>
								<td className="border p-1">
									<div className="flex justify-center gap-2">
										<Button
											color="orange"
											text="✏️"
											onClick={() => handleEditRoom(room.id)}
										/>
										<Button
											color="red"
											text="❌"
											onClick={() => handleDeleteRoom(room.id, room.number)}
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

export default RoomList;
