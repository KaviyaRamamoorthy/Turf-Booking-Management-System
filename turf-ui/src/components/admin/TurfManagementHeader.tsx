import { Button } from "primereact/button";
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { openModal } from "../../store/slices/uiSlice";

interface TurfManagementHeaderProps {
  onAddTurf?: () => void;
}

const TurfManagementHeader: React.FC<TurfManagementHeaderProps> = ({
  onAddTurf,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTurf = () => {
    if (onAddTurf) {
      onAddTurf();
    } else {
      dispatch(openModal("turfForm"));
    }
  };

  return (
    <div className="flex items-center justify-end">
      <Button
        label="Add Turf"
        icon="pi pi-plus"
        className="!bg-green-600 !hover:bg-green-700 !border-green-600 !hover:border-green-700 !text-white"
        onClick={handleAddTurf}
      />
    </div>
  );
};

export default TurfManagementHeader;
