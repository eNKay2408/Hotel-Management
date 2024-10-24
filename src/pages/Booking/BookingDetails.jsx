import { useState } from "react";
import { useParams } from "react-router-dom";

import { GuestForm, Title, Button } from "../../components";

const BookingDetails = () => {
	const { id } = useParams();

	const [guests, setGuests] = useState([1]);

	const handleAddGuest = () => {
		setGuests([...guests, guests.length + 1]);
	};

	const handleDeleteGuest = () => {
		if (guests.length > 1) {
			setGuests(guests.slice(0, guests.length - 1));
		}
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title={`Booking Details`} />

			<div className="text-center font-play mt-[-16px] text-2xl opacity-60">
				Start date:{" "}
				<span className="font-bold">
					{new Date().toLocaleDateString("en-GB")}
				</span>
			</div>

			<div className="flex justify-center gap-2 mt-4 py-4">
				<Button
					color="green"
					text="Add Guest"
					onClick={() => handleAddGuest()}
				/>
				<Button
					color="red"
					text="Delete Guest"
					onClick={() => handleDeleteGuest()}
				/>
			</div>

			<form
				className="flex flex-col items-center justify-evenly gap-4"
				action={`/booking/${id}`}
			>
				{guests.map((id) => (
					<GuestForm key={id} id={id} />
				))}

				<Button color="orange" text="CONFIRM" type="submit" />
			</form>
		</div>
	);
};

export default BookingDetails;
