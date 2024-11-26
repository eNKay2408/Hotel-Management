import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { Title, Button } from "../../components";
import { logoBackground } from "../../assets";
import { getInvoice } from "../../services";
import { hotelInformation } from "../../constants";

import html2pdf from "html2pdf.js";

const InvoiceDetails = () => {
	const { id } = useParams();

	// Add sample Data
	const [invoice, setInvoice] = useState({
		Representative: {
			Name: "RonalDo Mixi",
			Address: "Ho Chi Minh City",
		},
		InvoiceDate: "2022-12-31",
		Amount: 10000,
		Bookings: [
			{
				RoomNumber: "101",
				Nights: 3,
				Price: 100,
				ExtraCustomers: 0,
				SurchargeRate: 0.1,
				Coefficient: 1,
				Amount: 100,
			},
			{
				RoomNumber: "102",
				Nights: 2,
				Price: 200,
				ExtraCustomers: 1,
				SurchargeRate: 0.12,
				Coefficient: 1.2,
				Amount: 220,
			},
			{
				RoomNumber: "103",
				Nights: 1,
				Price: 300,
				ExtraCustomers: 2,
				SurchargeRate: 0.1,
				Coefficient: 1.8,
				Amount: 330,
			},
			{
				RoomNumber: "104",
				Nights: 4,
				Price: 350,
				ExtraCustomers: 1,
				SurchargeRate: 0.15,
				Coefficient: 1,
				Amount: 350,
			},
		],
	});

	const invoiceRef = useRef();

	const formatMoney = (number) => {
		return "$" + new Intl.NumberFormat("en-US").format(number);
	};

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		const opt = {
			filename: `invoice_${id}.pdf`,
		};

		html2pdf().from(invoiceRef.current).set(opt).save();
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Invoice Details" />

			<div
				className="flex flex-col mx-auto font-play md:w-[80%] w-full"
				ref={invoiceRef}
			>
				<div className="flex gap-4 p-4 bg-neutral-900 text-gray rounded-t-lg font-amethysta">
					<img
						src={logoBackground}
						alt="logo"
						className="w-40 lg:block hidden object-contain"
					/>
					<div className="flex flex-col md:items-center items-start flex-1">
						<h1 className="text-2xl font-bold text-yellow font-amethysta uppercase">
							{hotelInformation.name}
						</h1>
						<p>{hotelInformation.phone}</p>
						<p>{hotelInformation.email}</p>
					</div>
					<div className="flex md:text-center text-right items-center">
						{hotelInformation.address.split(",")[0] +
							", " +
							hotelInformation.address.split(",")[1]}
						<br />
						{hotelInformation.address.split(",")[2]}
						<br />
						{hotelInformation.address.split(",")[3]}
					</div>
				</div>

				<div className="flex flex-col gap-4 bg-zinc-200 p-4">
					<div className="flex gap-4 justify-between md:text-xl text-lg flex-wrap">
						<div>
							<p>Representative</p>
							<p className="font-bold">{invoice.Representative.Name}</p>
						</div>
						<div>
							<p>Address</p>
							<p className="font-bold">
								{invoice.Representative.Address &&
								invoice.Representative.Address.length > 20
									? invoice.Representative.Address.substring(0, 20) + "..."
									: invoice.Representative.Address}
							</p>
						</div>
						<div>
							<p>Invoice Date</p>
							<p className="font-bold">
								{new Date(invoice.InvoiceDate).toLocaleDateString("en-BS")}
							</p>
						</div>
						<div>
							<p>Invoice No</p>
							<p className="font-bold">#{id}</p>
						</div>
					</div>

					<div className="overflow-x-auto mt-2">
						<table className="w-full table-auto text-center md:text-lg text-base">
							<thead className="table-header-group text-lg">
								<tr className="table-row">
									<th className="bg-gray p-2">No</th>
									<th className="bg-gray p-2">Room</th>
									<th className="bg-gray p-2">Nights</th>
									<th className="bg-gray p-2">Price</th>
									<th className="bg-gray w-2/12 text-base p-2">
										Extra Customers
									</th>
									<th className="bg-gray w-2/12 text-base p-2">
										Surcharge Rate
									</th>
									<th className="bg-gray p-2">Coefficient</th>
									<th className="bg-gray p-2">Amount</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{invoice.Bookings.map((room, index) => (
									<tr
										key={index}
										className={index % 2 === 0 ? "bg-zinc-200" : "bg-white"}
									>
										<td className="py-2 px-1">{index + 1}</td>
										<td className="py-2 px-1">{room.RoomNumber}</td>
										<td className="py-2 px-1">{room.Nights}</td>
										<td className="py-2 px-1">{formatMoney(room.Price)}</td>
										<td className="py-2 px-1">
											{room.ExtraCustomers +
												" " +
												(room.ExtraCustomers > 1 ? "customers" : "customer")}
										</td>
										<td className="py-2 px-1">
											{room.SurchargeRate * 100 + "%"}
										</td>
										<td className="py-2 px-1">{room.Coefficient}</td>
										<td className="py-2 px-1">{formatMoney(room.Amount)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="flex justify-end items-end gap-2 font-bold tracking-widest">
						<p className="text-2xl">Total:</p>
						<p className="text-3xl text-red">{formatMoney(invoice.Amount)}</p>
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
