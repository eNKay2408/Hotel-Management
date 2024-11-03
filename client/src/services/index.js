// *Bookings*
export const getBookings = async () => {
	const response = await fetch("http://localhost:3000/api/bookings");
	return response.json();
};

// *Rooms*
export const getRooms = async () => {
	const response = await fetch("http://localhost:3000/api/rooms");
	return response.json();
};

export const deleteRoom = async (id) => {
	await fetch(`http://localhost:3000/api/rooms/${id}`, {
		method: "DELETE",
	});
};

export const getRoom = async (id) => {
	const response = await fetch(`http://localhost:3000/api/rooms/${id}`);
	return response.json();
};

// *Invoices*
export const getInvoices = async () => {
	const response = await fetch("http://localhost:3000/api/invoices");
	return response.json();
};

export const getInvoice = async (id) => {
	const response = await fetch(
		`http://localhost:3000/api/invoices/${id}`
	);
	return response.json();
};

// * Reports *
export const getReports = async () => {
	const response = await fetch("http://localhost:3000/api/reports");
	return response.json();
};

export const getRevenue = async (id) => {
	const response = await fetch(
		`http://localhost:3000/api/reports/revenue/${id}`
	);
	return response.json();
};

export const getOccupancy = async (id) => {
	const response = await fetch(
		`http://localhost:3000/api/reports/occupancy/${id}`
	);
	return response.json();
};

// * Regulations*
export const getRegulations = async () => {
	const response = await fetch("http://localhost:3000/api/regulations");
	return response.json();
};
