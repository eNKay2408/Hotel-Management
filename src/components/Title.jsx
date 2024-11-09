const Title = ({ title }) => {
	return (
		<div className="flex flex-col gap-2 mb-8">
			<h1 className="uppercase text-center font-amethysta text-yellow text-4xl">
				{title}
			</h1>
			<div className="flex items-center gap-4 justify-center">
				<hr className="w-40 border-[1px] border-yellow rounded-full" />
				<div className="w-4 h-4 rounded-full bg-yellow"></div>
				<hr className="w-40 border-[1px] border-yellow rounded-full" />
			</div>
		</div>
	);
};

export default Title;
