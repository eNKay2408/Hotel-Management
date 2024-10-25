import { Button } from "./index";

const BookingCard = ({
	booking: { room_id, number, type, quantity, area, price, status, image },
}) => {
	const handleBooking = (id) => {
		window.location.href = `/bookings/${id}`;
	};

	return (
		<div className="bg-zinc-200 md:p-4 p-1 rounded-md flex font-amethysta">
			<div className="flex items-center">
				<img
					src={image}
					alt={number}
					className="md:w-40 md:h-28 w-20 h-full rounded-md object-cover"
				/>
			</div>

			<div className="md:px-4 px-2 flex flex-col justify-center md:text-lg text-sm">
				<p>Number: {number}</p>
				<p>Type: {type}</p>
				<p>Quantity: {quantity}</p>
				<p>
					Area: {area}m<sup>2</sup>
				</p>
			</div>

			<div className="flex flex-1 flex-col items-center justify-center gap-2 ">
				<div className="flex flex-col">
					<p className="font-bold tracking-widest text-yellow text-xl">
						${price}
					</p>
					<p className="text-zinc-600 text-[12px] mt-[-2px]">per night</p>
				</div>
				<Button
					color="orange"
					text="BOOKING"
					disabled={status === "unavailable" ? true : false}
					onClick={() => handleBooking(room_id)}
				/>
			</div>
		</div>
	);
};

export default BookingCard;
