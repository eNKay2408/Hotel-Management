import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { Title, Button } from "../../components";
import { logoBackground } from "../../assets";
import { getInvoice } from "../../services";

import html2pdf from "html2pdf.js";

const InvoiceDetails = () => {
	/*
	* Get invoice data from API
	* API: GET /api/invoice/:id
	const { id } = useParams();
	
	const [invoice, setInvoice] = useState({});

	useEffect(() => {
		const loadInvoice = async () => {
			const data = await getInvoice(id);
			setInvoice(data);
		};
		loadInvoice();
	*/

	const invoiceRef = useRef();

	const [invoice, setInvoice] = useState({
		id: "123456",
		date: "2024-10-24",
		customer: {
			id: "123456",
			name: "Nguyen Van A",
			address: "Dormitory B - VNUHCM",
		},
		rooms: [
			{
				number: 101,
				rentalDays: 3,
				rate: 1500.0,
				amount: 4500.0,
			},
			{
				number: 102,
				rentalDays: 2,
				rate: 2000.0,
				amount: 4000.0,
			},
		],
		surcharge: 500.0,
	});

	const calculateSubtotal = (rooms) => {
		const total = rooms.reduce(
			(acc, room) => acc + room.rate * room.rentalDays,
			0
		);
		return total;
	};

	const formatMoney = (number) => {
		return "$" + new Intl.NumberFormat("en-US").format(number);
	};

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		const opt = {
			filename: `invoice_${invoice.id}.pdf`,
		};

		html2pdf().from(invoiceRef.current).set(opt).save();
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Invoice Details" />

			<div
				className="flex flex-col mx-auto font-play md:w-[70%] w-full"
				ref={invoiceRef}
			>
				<div className="flex gap-4 p-4 bg-zinc-600 text-gray rounded-t-lg">
					<img
						src={logoBackground}
						alt="logo"
						className="w-40 md:block hidden object-contain"
					/>
					<div className="flex flex-col items-center flex-1">
						<h1 className="text-2xl font-bold text-yellow font-amethysta">
							GOLDEN HOTEL
						</h1>
						<p>0123456789</p>
						<p>contact@golden-hotel.com</p>
					</div>
					<div className="flex text-center items-center">
						1234, Golden Street
						<br />
						Thu Duc District,
						<br />
						Ho Chi Minh
					</div>
				</div>

				<div className="flex flex-col gap-4 bg-zinc-200 p-4">
					<div className="grid grid-cols-2 gap-x-4 gap-y-2">
						<div>
							<p>Billed to</p>
							<p className="font-bold text-lg">{invoice.customer.name}</p>
						</div>
						<div>
							<p>Date</p>
							<p className="font-bold text-lg">
								{new Date(invoice.date).toLocaleDateString("en-BS")}
							</p>
						</div>
						<div>
							<p>Address</p>
							<p className="font-bold text-lg">{invoice.customer.address}</p>
						</div>
						<div>
							<p>Invoice number</p>
							<p className="font-bold text-lg">#{invoice.id}</p>
						</div>
					</div>

					<table className="table-auto text-center md:text-lg text-md">
						<thead className="table-header-group ">
							<tr className="table-row">
								<th className="border bg-gray">No</th>
								<th className="border bg-gray">Room Number</th>
								<th className="border bg-gray">Rental Days</th>
								<th className="border bg-gray">Rate</th>
								<th className="border bg-gray">Amount</th>
							</tr>
						</thead>
						<tbody>
							{invoice.rooms.map((room, index) => (
								<tr key={index}>
									<td className="border">{index + 1}</td>
									<td className="border">{room.number}</td>
									<td className="border">{room.rentalDays}</td>
									<td className="border">{formatMoney(room.rate)}</td>
									<td className="border"> {formatMoney(room.amount)}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex justify-end text-lg gap-4 relative">
						<div className="flex flex-col items-end ">
							<p>Sub Total</p>
							<p>Surcharge</p>
							<p className="mt-1 text-2xl">Total</p>
						</div>
						<div className="mr-4">
							<p className="font-bold">
								{formatMoney(calculateSubtotal(invoice.rooms))}
							</p>
							<p className="font-bold">{formatMoney(invoice.surcharge)}</p>
							<p className="font-bold text-red border-t-2 mt-1 text-2xl">
								{formatMoney(
									calculateSubtotal(invoice.rooms) + invoice.surcharge
								)}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center gap-4 mt-4">
				<Button
					color="green"
					text="Export PDF"
					onClick={() => handleDownload()}
				/>
				<Button
					color="orange"
					text="Print Invoice"
					onClick={() => handlePrint()}
				/>
			</div>
		</div>
	);
};

export default InvoiceDetails;
