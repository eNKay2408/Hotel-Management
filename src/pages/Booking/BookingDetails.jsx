import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CustomerForm, Title, Button } from "../../components";

import { createBooking, getRoomTypeByRoomNumber } from "../../services";

const BookingDetails = () => {
	const { id: Number } = useParams();

	const navigate = useNavigate();
	const isExecuted = useRef(false);

	const [customers, setCustomers] = useState(["", ""]);
	const [type, setType] = useState({
		Type: "A",
		Price: 100,
		MaxOccupancy: 4,
		SurchargeRate: 0.25,
		BaseCustomers: 2,
	});

	const handleAddCustomer = () => {
		if (customers.length >= type.MaxOccupancy) {
			alert(`Room ${Number} is at maximum occupancy of ${type.MaxOccupancy}`);
			return;
		}

		if (customers.length == type.BaseCustomers) {
			setCustomers((prev) => [...prev, prev.length + 1]);

			alert(
				`Room ${Number} has a surcharge rate of ${
					type.SurchargeRate * 100
				}% for each additional customer`
			);
			return;
		}

		setCustomers((prev) => [...prev, prev.length + 1]);
	};

	const handleDeleteCustomer = () => {
		if (customers.length <= 1) {
			alert("Customer list cannot be empty");
			return;
		}

		setCustomers((prev) => prev.slice(0, prev.length - 1));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);

		const customerMap = {};
		const customersData = [];

		formData.forEach((value, key) => {
			const [index, field] = key.split("-");

			if (!customerMap[index]) {
				customerMap[index] = {};
			}

			customerMap[index][field] = value;
		});

		for (const index in customerMap) {
			customersData.push(customerMap[index]);
		}

		const bookingData = {
			RoomId: Number,
			Customers: customersData,
		};

		const response = await createBooking(bookingData);

		if (response.status === 201) {
			alert("Booking created successfully");
			navigate("/bookings");
		} else {
			alert(response.text);
			console.error(response.text);
		}
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title={`Booking Details - Room ${Number}`} />

			<div className="text-center font-play mt-[-16px] text-2xl opacity-60">
				Start date:{" "}
				<span className="font-bold">
					{new Date().toLocaleDateString("en-GB")}
				</span>
			</div>

			<div className="flex justify-center gap-2 mt-4 py-4">
				<Button
					color="green"
					text="Add Customer"
					onClick={() => handleAddCustomer()}
				/>
				<Button
					color="red"
					text="Delete Customer"
					onClick={() => handleDeleteCustomer()}
				/>
			</div>

			<form
				className="flex flex-col items-center justify-evenly gap-4"
				onSubmit={handleSubmit}
			>
				{customers.map((_, index) => (
					<CustomerForm key={index + 1} index={index + 1} />
				))}
				<Button color="orange" text="CONFIRM" type="submit" />
			</form>
		</div>
	);
};

export default BookingDetails;
