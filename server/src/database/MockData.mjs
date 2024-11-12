class Room {
	constructor(_RoomID, _RoomType, _Price, _RoomStatus, _Des) {
		this.RoomID = _RoomID;
		this.RoomType = _RoomType;
		this.Price = _Price;
		this.RoomStatus = _RoomStatus;
		this.Des = _Des;
	}
}

class Customer {
	constructor(CustomerID, CustomerName, Addess, CitizenCard, Type) {
		this.CustomerID = CustomerID;
		this.CustomerName = CustomerName;
		this.Addess = Addess;
		this.CitizenCard = CitizenCard;
		this.Type = Type;
	}
}

class Invoice {
	constructor(InvoiceID, TotalCost, Representator) {
		this.InvoiceID = InvoiceID;
		this.TotalCost = TotalCost;
		this.Representator = Representator;
	}
}

class InvoiceDetails {
	constructor(InvoiceID, BookingID) {
		this.InvoiceID = InvoiceID;
		this.BookingID = BookingID;
	}
}

class Booking {
	constructor(BookingID, RoomID, BookingDate, CheckOutDate, Cost) {
		this.BookingID = BookingID;
		this.RoomID = RoomID;
		this.BookingDate = BookingDate;
		this.CheckOutDate = CheckOutDate;
		this.Cost = Cost;
	}
}

class BookingDetails {
	constructor(BookingID, CustomerID) {
		this.BookingID = BookingID;
		this.CustomerID = CustomerID;
	}
}

const MockRoom = [
	{
		RoomID: 101,
		RoomType: "A",
		Price: 150,
		RoomStatus: "In Use",
		Des: "",
	},
	{
		RoomID: 102,
		RoomType: "B",
		Price: 170,
		RoomStatus: "In Use",
		Des: "",
	},
	{
		RoomID: 103,
		RoomType: "C",
		Price: 200,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 104,
		RoomType: "A",
		Price: 150,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 105,
		RoomType: "B",
		Price: 170,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 106,
		RoomType: "C",
		Price: 200,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 201,
		RoomType: "A",
		Price: 150,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 202,
		RoomType: "B",
		Price: 170,
		RoomStatus: "Empty",
		Des: "",
	},
	{
		RoomID: 203,
		RoomType: "C",
		Price: 200,
		RoomStatus: "In Use",
		Des: "",
	},
];

const MockCustomer = [
	{
		CustomerID: 1,
		CustomerName: "Huy",
		Addess: "bcons bee, Binh Duong",
		CitizenCard: "066204006779",
		Type: "dosmetic",
	},
	{
		CustomerID: 2,
		CustomerName: "Ty",
		Addess: "KTX khu B, Thu Duc",
		CitizenCard: "066204006778",
		Type: "dosmetic",
	},
	{
		CustomerID: 3,
		CustomerName: "Trinh",
		Addess: "Quan 10, HCM",
		CitizenCard: "066204006777",
		Type: "dosmetic",
	},
	{
		CustomerID: 4,
		CustomerName: "Lebron James",
		Addess: "Los Angeles, USA",
		CitizenCard: "",
		Type: "Foreign",
	},
];

const MockInvoice = [
	{
		InvoiceID: 1,
		TotalCost: 300,
		Representator: 1,
	},
	{
		InvoiceID: 2,
		TotalCost: 510,
		Representator: 2,
	},
];

const MockInvoiceDetails = [
	{
		InvoiceID: 1,
		BookingID: 1,
	},
	{
		InvoiceID: 2,
		BookingID: 2,
	},
];

// const MockBooking = [
// 	{
// 		BookingID: 1,
// 		RoomID: 101,
// 		BookingDate: "2024-10-15",
// 		CheckOutDate: "2024-10-16",
// 		Cost: 300,
// 	},
// 	{
// 		BookingID: 2,
// 		RoomID: 102,
// 		BookingDate: "2024-10-15",
// 		CheckOutDate: "2024-10-16",
// 		Cost: 340,
// 	},
// ];

const MockBooking = [
	{
		room_id: 1,
		number: 101,
		type: "A",
		quantity: 3,
		area: 500,
		price: 299,
		status: "available",
		image: "https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	},
	{
		room_id: 2,
		number: 102,
		type: "B",
		quantity: 2,
		area: 800,
		price: 199,
		status: "unavailable",
		image: "https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	},
	{
		room_id: 3,
		number: 103,
		type: "C",
		quantity: 1,
		area: 600,
		price: 99,
		status: "available",
		image: "https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	},
	{
		room_id: 4,
		number: 104,
		type: "D",
		quantity: 4,
		area: 900,
		price: 399,
		status: "unavailable",
		image: "https://res.cloudinary.com/dvzhmi7a9/image/upload/v1729681254/PlaceHolderRoom.png",
	},
];

const MockBookingDetails = [
	{
		BookingID: 1,
		CustomerID: 1,
	},
	{
		BookingID: 1,
		CustomerID: 3,
	},
	{
		BookingID: 2,
		CustomerID: 2,
	},
	{
		BookingID: 2,
		CustomerID: 4,
	},
];

const MockData = {
	Room,
	Customer,
	Booking,
	BookingDetails,
	Invoice,
	InvoiceDetails,
	MockRoom,
	MockCustomer,
	MockInvoice,
	MockInvoiceDetails,
	MockBooking,
	MockBookingDetails,
};

export default MockData;
