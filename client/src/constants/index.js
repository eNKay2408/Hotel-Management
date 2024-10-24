import {
	bookingIcon,
	reportIcon,
	roomIcon,
	homeIcon,
	invoiceIcon,
	regulationIcon,
	facebook,
	twitter,
	instagram,
	linkedin,
} from "../assets";

export const navLinks = [
	{
		id: "",
		title: "Home",
		icon: homeIcon,
	},
	{
		id: "bookings",
		title: "Bookings",
		icon: bookingIcon,
	},
	{
		id: "rooms",
		title: "Rooms",
		icon: roomIcon,
	},
	{
		id: "invoices",
		title: "Invoices",
		icon: invoiceIcon,
	},
	{
		id: "reports",
		title: "Reports",
		icon: reportIcon,
	},
	{
		id: "regulations",
		title: "Regulations",
		icon: regulationIcon,
	},
];

export const footerLinks = [
	{
		id: "term",
		title: "Term of Use",
	},
	{
		id: "privacy",
		title: "Privacy Police",
	},
	{
		id: "services",
		title: "Services & Facilities",
	},
	{
		id: "careers",
		title: "Careers",
	},
];

export const socialLinks = [
	{
		id: "facebook",
		icon: facebook,
		url: "https://www.facebook.com",
	},
	{
		id: "twitter",
		icon: twitter,
		url: "https://www.twitter.com",
	},
	{
		id: "instagram",
		icon: instagram,
		url: "https://www.instagram.com",
	},
	{
		id: "linkedin",
		icon: linkedin,
		url: "https://www.linkedin.com",
	},
];

export const bookingInformation = [
	{
		id: "full-name",
		label: "Full name",
		type: "text",
	},
	{
		id: "identity-card-number",
		label: "Identify Card Number",
		type: "number",
	},
	{
		id: "guests-type",
		label: "Guest’s Type",
		type: "text",
	},
	{
		id: "address",
		label: "Address",
		type: "text",
	},
];
