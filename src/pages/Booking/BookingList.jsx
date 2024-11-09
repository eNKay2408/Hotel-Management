import { useEffect, useState } from "react";

import { Title, BookingCard } from "../../components";
import { getBookings } from "../../services";

const BookingList = () => {
	// Get bookings data from API
	// API: GET /api/bookings
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const loadBookings = async () => {
			const data = await getBookings();
			setBookings(data);
		};
		loadBookings();
	}, []);

	// const [bookings, setBookings] = useState([
	// 	{
	// 		room_id: 1,
	// 		number: 101,
	// 		type: "A",
	// 		quantity: 3,
	// 		area: 500,
	// 		price: 299,
	// 		status: "available",
	// 		image:
	// 			"https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	// 	},
	// 	{
	// 		room_id: 2,
	// 		number: 102,
	// 		type: "B",
	// 		quantity: 2,
	// 		area: 800,
	// 		price: 199,
	// 		status: "unavailable",
	// 		image:
	// 			"https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	// 	},
	// 	{
	// 		room_id: 3,
	// 		number: 103,
	// 		type: "C",
	// 		quantity: 1,
	// 		area: 600,
	// 		price: 99,
	// 		status: "available",
	// 		image:
	// 			"https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	// 	},
	// 	{
	// 		room_id: 4,
	// 		number: 104,
	// 		type: "D",
	// 		quantity: 4,
	// 		area: 900,
	// 		price: 399,
	// 		status: "unavailable",
	// 		image:
	// 			"https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	// 	},
	// ]);

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Booking List" />

			<div className="flex flex-wrap items-center justify-evenly gap-4">
				{bookings.map((booking, index) => (
					<BookingCard
						key={index}
						booking={booking}
					/>
				))}
			</div>
		</div>
	);
};

export default BookingList;
