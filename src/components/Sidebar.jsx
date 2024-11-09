import { useLocation } from "react-router-dom";

const Sidebar = () => {
	const location = useLocation();

	const getTitle = () => {
		if (location.pathname === "/") {
			return "Home";
		}

		const path = location.pathname.split("/")[1];
		return path.charAt(0).toUpperCase() + path.slice(1);
	};

	return (
		<div className="md:flex hidden md:w-[144px] w-[50px] bg-zinc-200 border-r-4 border-gray items-center justify-center">
			<p className="md:text-[70px] text-orange font-play transform rotate-[-90deg]">
				{getTitle()}
			</p>
		</div>
	);
};

export default Sidebar;
