import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
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

const TurfManagementPage: React.FC<TurfManagementPageProps> = ({
  onEditTurf,
  onAddTurf,
  onDeleteTurf,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { turfs, isLoading, error } = useSelector(
    (state: RootState) => state.turf
  );

  // Load turfs on component mount
  useEffect(() => {
    dispatch(fetchTurfs(undefined));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
     <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 text-center p-4">
         <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Turfs found
            </h3>  
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TurfManagementHeader onAddTurf={onAddTurf} />
      <TurfManagementList
        turfs={turfs}
        onEditTurf={onEditTurf}
        onDeleteTurf={onDeleteTurf}
      />
    </div>
  );
};

export default TurfManagementPage;
