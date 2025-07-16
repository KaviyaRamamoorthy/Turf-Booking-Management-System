import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TurfManagementHeader from "../../components/admin/TurfManagementHeader";
import TurfManagementList from "../../components/admin/TurfManagementList";
import type { AppDispatch } from "../../store";
import { fetchTurfs } from "../../store/slices/turfSlice";
import type { RootState, Turf } from "../../types";

interface TurfManagementPageProps {
  onEditTurf?: (turf: Turf) => void;
  onAddTurf?: () => void;
  onDeleteTurf?: (turf: Turf) => void;
}

const TurfManagementPage: React.FC<TurfManagementPageProps> = ({ onEditTurf, onAddTurf, onDeleteTurf }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { turfs, isLoading, error } = useSelector(
    (state: RootState) => state.turf
  );

  useEffect(() => {
    dispatch(fetchTurfs());
  }, [dispatch]);

  if (isLoading && turfs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Message severity="error" text={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TurfManagementHeader onAddTurf={onAddTurf} />
      <TurfManagementList turfs={turfs} onEditTurf={onEditTurf} onDeleteTurf={onDeleteTurf} />
    </div>
  );
};

export default TurfManagementPage;