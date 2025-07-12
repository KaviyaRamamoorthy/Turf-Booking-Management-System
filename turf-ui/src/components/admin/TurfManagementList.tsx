import React from "react";
import type { Turf } from "../../types";
import TurfManagementCard from "./TurfManagementCard";

interface TurfManagementListProps {
  turfs: Turf[];
  onEditTurf?: (turf: Turf) => void;
  onDeleteTurf?: (turf: Turf) => void;
}

const TurfManagementList: React.FC<TurfManagementListProps> = ({ turfs, onEditTurf, onDeleteTurf }) => {
  if (turfs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <i className="pi pi-map-marker text-6xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Turfs Found
        </h3>
        <p className="text-gray-600">
          Get started by adding your first turf to the platform.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <TurfManagementCard key={turf.id} turf={turf} onEditTurf={onEditTurf} onDeleteTurf={onDeleteTurf} />
        ))}
      </div>
    </div>
  );
};

export default TurfManagementList; 