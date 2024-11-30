import { bookingInformation, imageUrlList } from '../constants';
import { getCustomerTypes } from '../services';
import { useState, useEffect } from 'react';

const CustomerForm = ({ index, handleErrors }) => {
  const [customerTypes, setCustomerTypes] = useState();
  const [errors, setErrors] = useState({});

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

  const disallowNonAlphabeticInput = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z\s]/, '');
  };

  const validateName = (name) => {
    if (name.length < 3) {
      return 'Name must be at least 3 characters long.';
    }
    return '';
  };

  const validateIdentityCard = (cccd) => {
    if (!/^\d{12}$/.test(cccd)) {
      return 'Identity card must contain exactly 12 digits.';
    }
    return '';
  };

  const validateAddress = (address) => {
    if (address.length < 6) {
      return 'Address must be at least 6 characters long.';
    }
    return '';
  };

  const handleInputChange = (e, info) => {
    const { name, value } = e.target;
    let error;

    if (info.name === 'Name') {
      error = validateName(value);
    } else if (info.name === 'IdentityCard') {
      error = validateIdentityCard(value);
    } else if (info.name === 'Address') {
      error = validateAddress(value);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    handleErrors(index, info.name, error);
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
              <label className="text-base">{info.label}</label>
              <br />
              <input
                required
                type={info.type}
                className="rounded-md p-2 border-gray border-2 lg:w-64 md:w-48 w-64"
                name={`${index}-${info.name}`}
                onInput={
                  info.name === 'IdentityCard'
                    ? disallowNonNumericInput
                    : info.name === 'Name'
                    ? disallowNonAlphabeticInput
                    : null
                }
                onChange={(e) => handleInputChange(e, info)}
              />
              {errors[`${index}-${info.name}`] && (
                <div className="lg:w-64 md:w-48 w-64">
                  <span className="text-red text-xs">
                    {errors[`${index}-${info.name}`]}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div>
            <label className="text-base">Customer Type</label>
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
