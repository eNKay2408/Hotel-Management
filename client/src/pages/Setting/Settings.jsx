import { useState } from 'react';

import { Title } from '../../components';

import RoomTypes from './RoomTypes';
import CustomerTypes from './CustomerTypes';

const Settings = () => {
  const [isRoomTypes, setIsRoomTypes] = useState(true);

  return (
    <div className="flex flex-col w-full py-4 px-2 min-h-80">
      <Title title="Settings" />

      <div className="w-full max-w-[800px] mx-auto flex justify-evenly md:text-2xl text-lg font-bold font-play bg-black py-3">
        <button
          className={`md:px-6 px-2 py-1 ${
            isRoomTypes
              ? 'text-red border-b-2 border-red '
              : 'text-zinc-500 hover:text-red transition-colors duration-300'
          }`}
          onClick={() => setIsRoomTypes(true)}
        >
          Room Types
        </button>
        <button
          className={`md:px-6 px-2 py-1 ${
            isRoomTypes
              ? 'text-zinc-500 hover:text-red transition-colors duration-300'
              : 'text-red border-b-2 border-red'
          }`}
          onClick={() => setIsRoomTypes(false)}
        >
          Customer Types
        </button>
      </div>

      {isRoomTypes ? <RoomTypes /> : <CustomerTypes />}
    </div>
  );
};

export default Settings;
