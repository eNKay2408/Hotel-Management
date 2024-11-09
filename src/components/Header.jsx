import { logo } from "../assets";
import { navLinks } from "../constants";

const Header = () => {
	return (
		<nav className="flex items-center border-b-4 border-gray">
			<a href="/" className="md:border-r-4 border-gray">
				<img
					src={logo}
					alt="logo"
					className="md:w-[140px] md:p-4 px-2 w-[100px]"
				/>
			</a>

			<ul className="list-none flex flex-1 flex-wrap justify-between gap-2 px-4 md:py-0 py-2">
				{navLinks.map((link) => (
					<li
						key={link.id}
						className="font-play cursor-pointer md:text-2xl text-xl text-gray hover:text-orange uppercase"
					>
						<a
							href={`${link.id !== "" ? `/${link.id}` : "/"}`}
							className="flex gap-2 items-center"
						>
							<img src={link.icon} alt={link.title} className="w-6 h-6" />
							{link.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Header;
