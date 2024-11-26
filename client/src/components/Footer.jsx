import { logoBackground } from '../assets';
import { footerLinks, socialLinks } from '../constants';

const Footer = () => {
  return (
    <div className="bg-gradient-to-b from-zinc-800 to-black text-gray border-t-4 border-gray font-play">
      <div className="flex md:flex-row flex-col justify-between w-full py-6 px-8 gap-6">
        <div className="flex flex-col gap-4 w-64">
          <img src={logoBackground} className="w-full opacity-90" />
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <a
                href={link.id}
                key={link.id}
                className="hover:text-orange transition duration-300"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-yellow font-bold text-lg">GOLDEN HOTEL CHAIN</p>
          <div className="flex flex-col text-sm gap-2 leading-relaxed">
            <p>
              <strong>Headquarter:</strong> 6th Floor - Ladeco Building - 266
              Doi Can - Lieu Giai Ward - Ba Dinh District - Hanoi City
            </p>
            <div>
              <strong>Branch:</strong>
              <ul className="list-disc ml-5">
                <li>
                  5th Floor, Lu Gia Building, No. 70 Lu Gia Street, District 11,
                  Ho Chi Minh City
                </li>
                <li>
                  No. 83 Xo Viet Nghe Tinh Street, Khue Trung Ward - Cam Le
                  District - Da Nang City
                </li>
              </ul>
            </div>
            <p>
              <strong>Call Center Support:</strong>
              <ul className="list-disc ml-5">
                <li>
                  Support for use: <strong>1900 6750</strong>
                </li>
                <li>
                  Email: <strong>support@golden.com</strong>
                </li>
              </ul>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-center gap-2">
          <p className="text-yellow font-bold text-lg">FOLLOW US</p>
          <div className="flex flex-wrap gap-4 md:justify-center">
            {socialLinks.map((link) => (
              <a
                href={link.url}
                key={link.id}
                target="_blank"
                className="hover:bg-orange p-2 rounded-full transition duration-300"
              >
                <img src={link.icon} className="w-6 p-[2px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 text-center text-gray text-xs py-3">
        © 2021 Golden Hotel Chain. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
