import { bookingInformation } from '../constants';
import {
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
} from '../assets';

import { getCustomerTypes } from '../services';
import { useState, useEffect } from 'react';

const CustomerForm = ({ index }) => {
  const imageUrlList = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    avatar10,
  ];

  const [customerTypes, setCustomerTypes] = useState();

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      const data = await getCustomerTypes();
      setCustomerTypes(data);
    };

    fetchCustomerTypes();
  }, []);

  const disallowNonNumericInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/, '');
  };

  return (
    <div className="flex flex-col">
      <div className=" p-2 font-play text-2xl bg-zinc-200 rounded-t-lg">
        Customer #{index}
      </div>

      <div className="flex md:flex-row flex-col items-center justify-evenly gap-4 border-4 border-zinc-200 p-2">
        <div className="flex items-center">
          <img
            className="w-28 h-28"
            src={imageUrlList[index - 1]}
            alt={`Avatar ${index}`}
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 font-amethysta p-2">
          {bookingInformation.map((info) => (
            <div key={info.name}>
              <label className="text-md">{info.label}</label>
              <br />
              <input
                required
                type={info.type}
                className="rounded-md p-2 border-gray border-2 lg:w-64 md:w-48 w-64"
                name={`${index}-${info.name}`}
                onInput={
                  info.name === 'IdentityCard' ? disallowNonNumericInput : null
                }
              />
            </div>
          ))}
          <div>
            <label className="text-md">Customer Type</label>
            <br />
            <select
              required
              className="rounded-md p-2 border-gray border-2 lg:w-64 md:w-48 w-64 h-[43px]"
              name={`${index}-Type`}
            >
              {customerTypes &&
                customerTypes.map((type) => (
                  <option key={type.Type} value={type.Type}>
                    {type.Name[0].toUpperCase() + type.Name.slice(1)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
