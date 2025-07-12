import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TurfManagementPage from "../../pages/admin/TurfManagementPage";
import TurfFormModal from "./TurfFormModal";
import { closeModal, openModal } from "../../store/slices/uiSlice";
import type { Turf } from "../../types";
import type { RootState } from "../../types";

const TurfManagementContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state: RootState) => state.ui);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [editMode, setEditMode] = useState(false);

  const isModalVisible = modals["turfForm"] || false;

  const handleCloseModal = () => {
    dispatch(closeModal("turfForm"));
    setSelectedTurf(null);
    setEditMode(false);
  };

  const handleEditTurf = (turf: Turf) => {
    setSelectedTurf(turf);
    setEditMode(true);
    dispatch(closeModal("turfForm")); // Close any existing modal
    setTimeout(() => {
      dispatch(openModal("turfForm")); // Open with edit mode
    }, 100);
  };

  const handleAddTurf = () => {
    setSelectedTurf(null);
    setEditMode(false);
    dispatch(closeModal("turfForm")); // Close any existing modal
    setTimeout(() => {
      dispatch(openModal("turfForm")); // Open with add mode
    }, 100);
  };

  return (
    <>
      <TurfManagementPage onEditTurf={handleEditTurf} onAddTurf={handleAddTurf} />
      <TurfFormModal
        visible={isModalVisible}
        onHide={handleCloseModal}
        editMode={editMode}
        turfToEdit={selectedTurf}
      />
    </>
  );
};

export default TurfManagementContainer; 