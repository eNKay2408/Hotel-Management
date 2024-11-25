import {
  bookingIcon,
  reportIcon,
  roomIcon,
  homeIcon,
  invoiceIcon,
  regulationIcon,
  facebook,
  x,
  instagram,
  linkedin,
} from '../assets';

export const navLinks = [
  {
    id: '',
    title: 'Home',
    icon: homeIcon,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    icon: bookingIcon,
  },
  {
    id: 'rooms',
    title: 'Rooms',
    icon: roomIcon,
  },
  {
    id: 'invoices',
    title: 'Invoices',
    icon: invoiceIcon,
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: reportIcon,
  },
  {
    id: 'regulations',
    title: 'Regulations',
    icon: regulationIcon,
  },
];

export const footerLinks = [
  {
    id: 'terms',
    title: 'Terms of Use',
  },
  {
    id: 'services',
    title: 'Services & Facilities',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
  },
  {
    id: 'careers',
    title: 'Careers',
  },
];

export const socialLinks = [
  {
    id: 'facebook',
    icon: facebook,
    url: 'https://www.facebook.com',
  },
  {
    id: 'x',
    icon: x,
    url: 'https://www.x.com',
  },
  {
    id: 'instagram',
    icon: instagram,
    url: 'https://www.instagram.com',
  },
  {
    id: 'linkedin',
    icon: linkedin,
    url: 'https://www.linkedin.com',
  },
];

export const bookingInformation = [
  {
    label: 'Full Name',
    type: 'text',
    name: 'Name',
  },
  {
    label: 'Identify Card',
    type: 'text',
    name: 'IdentityCard',
  },
  {
    label: 'Address',
    type: 'text',
    name: 'Address',
  },
];
