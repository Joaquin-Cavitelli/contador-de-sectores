import { Link } from "react-router-dom";
import { formatDateTime } from "../utils/helpers";

function SectorCard({ sector }) {
  return (
    <Link to={`/sector/${sector.id}`} className="block">
      <div
        className={`${
          sector.completed ? "border-l-4 border-l-green-600  pl-4" : " "
        } bg-white rounded shadow-md p-6 pb-4 text-gray-700 border border-gray-300`}
      >
        <div className="flex justify-between items-center relative">
          <p className=" font-bold">{sector.name}</p>
          {sector.completed ? (
            <span className="bg-green-50 text-green-800 text-xs py-1 px-2  rounded-full border border-green-200 absolute top-0 right-0">
              Completado
            </span>
          ) :
          (
            <span className="bg-yellow-50 text-yellow-800 text-xs py-1 px-2  rounded-full border border-yellow-200 absolute top-0 right-0">
              Pendiente
            </span>
          )}
        </div>

        <div className="">
          <p className="text-sm mb-3">{sector.manager}</p>

          <div className="flex items-center gap-2 text-sm justify-between">
            <div className=" flex items-center gap-1">
              <span className="text-xl font-bold text-gray-600">
                {sector.attendees || 0}
              </span>
              <span className="material-symbols-outlined ">group</span>
            </div>
            {sector.lastUpdated && (
              <div className="text-xs justify-self-end">
                <span className="">
                  {formatDateTime(sector.lastUpdated)} hs
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SectorCard;
