import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TurfManagementPage from "../../pages/admin/TurfManagementPage";
import type { AppDispatch } from "../../store";
import { deleteTurf } from "../../store/slices/turfSlice";
import { addToast, closeModal, openModal } from "../../store/slices/uiSlice";
import type { RootState, Turf } from "../../types";
import TurfFormModal from "./TurfFormModal";

const TurfManagementContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { modals } = useSelector((state: RootState) => state.ui);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [editMode, setEditMode] = useState(false);

  const isTurfModalVisible = modals["turfForm"] || false;

  const handleCloseTurfModal = () => {
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

  const handleDeleteTurf = (turf: Turf) => {
    confirmDialog({
      message: `Are you sure you want to delete "${turf.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger submit-button",
      rejectClassName: "p-button-success cancel-button",
      accept: () => {
        dispatch(deleteTurf(turf.id))
          .unwrap()
          .then(() => {
            dispatch(
              addToast({
                type: "success",
                title: "Success",
                message: "Turf deleted successfully",
              })
            );
          })
          .catch((error) => {
            dispatch(
              addToast({
                type: "error",
                title: "Error",
                message: error || "Failed to delete turf",
              })
            );
          });
      },
    });
  };

  return (
    <>
      <TurfManagementPage
        onEditTurf={handleEditTurf}
        onAddTurf={handleAddTurf}
        onDeleteTurf={handleDeleteTurf}
      />
      <TurfFormModal
        visible={isTurfModalVisible}
        onHide={handleCloseTurfModal}
        editMode={editMode}
        turfToEdit={selectedTurf}
      />
      <ConfirmDialog />
    </>
  );
};

export default TurfManagementContainer;
