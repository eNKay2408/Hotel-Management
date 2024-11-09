import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const guestsData = [];
		const guestMap = {};

		formData.forEach((value, key) => {
			const [index, field] = key.split("-");

			if (!guestMap[index]) {
				guestMap[index] = {};
			}

			guestMap[index][field] = value;
		});

		for (const index in guestMap) {
			guestsData.push(guestMap[index]);
		}

		const response = await fetch(`/api/bookings/${id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(guestsData),
		});

		navigate(`/bookings`);

		/*
		* API: Create booking

		if (response.ok) {
			alert("Booking created successfully");
			navigate(`/bookings/${id}`);
		} else {
			alert("Failed to create booking");
			console.error(response);
		}
		*/
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
				onSubmit={handleSubmit}
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
