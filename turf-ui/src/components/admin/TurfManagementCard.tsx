import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Rating } from "primereact/rating";
import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { deleteTurf } from "../../store/slices/turfSlice";
import { addToast, openModal } from "../../store/slices/uiSlice";
import type { Turf } from "../../types";

interface TurfManagementCardProps {
    turf: Turf;
    onEditTurf?: (turf: Turf) => void;
    onDeleteTurf?: (turf: Turf) => void;
}

const TurfManagementCard: React.FC<TurfManagementCardProps> = ({ turf, onEditTurf, onDeleteTurf }) => {
    const dispatch = useDispatch<AppDispatch>();

    const getCategoryColor = (category: string | undefined) => {
        if (!category) return "contrast";
        
        switch (category.toLowerCase()) {
            case "football":
                return "success";
            case "cricket":
                return "info";
            case "tennis":
                return "warning";
            case "basketball":
                return "danger";
            case "volleyball":
                return "secondary";
            default:
                return "contrast";
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount);
    };

    const handleEdit = () => {
        if (onEditTurf) {
            onEditTurf(turf);
        } else {
            dispatch(openModal("turfForm"));
        }
    };

    const handleDelete = () => {
        if (onDeleteTurf) {
            onDeleteTurf(turf);
        } else {
            // Fallback to direct deletion without confirmation
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
        }
    };

    const header = (
        <div className="relative">
            <img
                src="https://5.imimg.com/data5/SELLER/Default/2023/10/350327019/NU/WB/TZ/38215148/7-a-side-football-turf-1000x1000.jpg"
                alt={turf.name}
                className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
                <Badge
                    value={turf.category}
                    severity={getCategoryColor(turf.category)}
                    className="capitalize"
                />
            </div>
        </div>
    );

    const footer = (
        <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-2">
                <Rating
                    value={turf.rating}
                    readOnly
                    cancel={false}
                    className="text-sm"
                />
                <span className="text-sm text-gray-600">({turf.reviewCount})</span>
            </div>
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    size="small"
                    outlined
                    onClick={handleEdit}
                    tooltip="Edit Turf"
                />
                <Button
                    icon="pi pi-trash"
                    size="small"
                    outlined
                    severity="danger"
                    onClick={handleDelete}
                    tooltip="Delete Turf"
                />
            </div>
        </div>
    );

    return (
            <Card
                header={header}
                footer={footer}
                className="shadow-md hover:shadow-lg transition-shadow duration-200 h-full"
            >
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {turf.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {turf.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-600">
                        <i className="pi pi-map-marker mr-1"></i>
                        <span>
                            {turf.location.city}, {turf.location.state}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-green-600">
                            {formatCurrency(turf.pricing.hourlyRate, turf.pricing.currency)}
                            <span className="text-sm font-normal text-gray-600">/hour</span>
                        </div>

                        {turf.amenities.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                                <i className="pi pi-check-circle mr-1"></i>
                                <span>{turf.amenities.length} amenities</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
    );
};

export default TurfManagementCard; 