import { Title, Button } from "../../components";

const InvoiceList = () => {
	const handleInvoiceDetails = () => {
		window.location.href = "/invoices/1";
	};

	return (
		<div className="flex flex-col w-full py-4 px-2">
			<Title title="Invoice List" />
			<Button
				color="orange"
				text="Invoice Details"
				onClick={() => handleInvoiceDetails()}
			/>
			<div className="h-[280px]"></div>
		</div>
	);
};

export default InvoiceList;
