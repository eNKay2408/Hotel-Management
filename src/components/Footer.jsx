import { logoBackground } from "../assets";
import { footerLinks, socialLinks } from "../constants";

const Footer = () => {
	return (
		<div className="flex md:flex-row flex-col justify-around w-full p-5 gap-4 font-play border-y-4 border-gray bg-zinc-800 text-gray">
			<div className="flex flex-col items-start gap-4">
				<p className="font-bold text-2xl">
					Find anything you want
				</p>
				<form>
					<input
						type="text"
						placeholder="Enter your email here"
						className="p-2 rounded-l-md md:text-lg text-sm"
					/>
					<button className="p-2 bg-yellow text-white md:text-lg text-sm rounded-r-md opacity-90 hover:opacity-100">
						Subscribe
					</button>
				</form>
				<hr className="w-full" />
				<p>
					© 2024 Golden Hotels.
					<br className="md:hidden" /> All right reserved.
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<img src={logoBackground} className="w-40" />
				<div className="flex flex-wrap gap-4">
					<div className="flex flex-col">
						{footerLinks
							.slice(0, 2)
							.map((link) => (
								<a
									href={
										link.id
									}
									key={
										link.id
									}
									className="hover:text-orange"
								>
									{
										link.title
									}
								</a>
							))}
					</div>
					<div className="flex flex-col">
						{footerLinks
							.slice(2, 4)
							.map((link) => (
								<a
									href={
										link.id
									}
									key={
										link.id
									}
									className="hover:text-orange"
								>
									{
										link.title
									}
								</a>
							))}
					</div>
				</div>

				<div className="flex flex-wrap gap-4">
					{socialLinks.map((link) => (
						<a
							href={link.url}
							key={link.id}
							target="_blank"
							className="hover:bg-orange p-1 rounded-full"
						>
							<img
								src={link.icon}
								className="w-6"
							/>
						</a>
					))}
				</div>
			</div>
		</div>
	);
};

export default Footer;
