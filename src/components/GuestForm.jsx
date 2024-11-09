import { bookingInformation } from "../constants";
import { avatar1, avatar2, avatar3, avatar4 } from "../assets";
const disallowNonNumericInput = (e) => {
	e.target.value = e.target.value.replace(/[^0-9]/, "");
};
const GuestForm = ({ id }) => {
	const imageUrlList = [avatar1, avatar2, avatar3, avatar4];

	return (
		<div className="flex flex-col">
			<div className=" p-2 font-play text-2xl bg-zinc-200 rounded-t-lg">
				Guest #{id}
			</div>

			<div className="flex md:flex-row flex-col items-center justify-evenly gap-4 border-4 border-zinc-200 p-2">
				<div className="flex items-center">
					<img
						className="w-28 h-28"
						src={imageUrlList[id - 1]}
					/>
				</div>
				<div className="grid md:grid-cols-2 grid-cols-1 gap-4 font-amethysta p-2">
					{bookingInformation.map((info) => (
						<div key={info.name}>
							<label className="text-md">
								{info.label}
							</label>
							<br />
							<input
								required
								type={info.type}
								className="rounded-md p-2 border-gray border-2 lg:w-64 md:w-48 w-64"
								name={`${id}-${info.name}`}
								onInput={
									info.name ===
									"idCardNumber"
										? disallowNonNumericInput
										: null
								}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GuestForm;
