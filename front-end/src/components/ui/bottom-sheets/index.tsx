import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";

import ResetPasswordBottomSheet, {
  ResetPasswordSheetDefinition,
} from "./reset-password";
import LogoutConfirmationSheet, {
  LogoutConfirmationSheetDefinition,
} from "./logout-confirmtion";
import BookingSheet, { BookingSheetDefinition } from "./booking/booking-sheet";
import UnbookmarkConfirmationSheet from "./unbookmark";
import CancelBookingConfirmationSheet, {
  CancelBookingConfirmationSheetDefinition,
} from "./cancel-booking-confirmation";
import DoctorsFilterSheet from "./doctors-filter-sheet";
import CancelAppointmentSheet from "./cancel-appointment-sheet";
import SelectBottomSheet, { SelectBottomSheetDefinition } from "./select/SelectBottomSheet";

const sheets: Record<string, React.ElementType> = {
  "reset-password": ResetPasswordBottomSheet,
  "logout-confirmation": LogoutConfirmationSheet,
  "unbookmark-confirmation": UnbookmarkConfirmationSheet,
  booking: BookingSheet,
  "cancel-booking-confirmation": CancelBookingConfirmationSheet,
  "doctor-filters-sheet": DoctorsFilterSheet,
  "cancel-appointment-sheet": CancelAppointmentSheet,
  "select-bottom-sheet": SelectBottomSheet,
};

(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

declare module "react-native-actions-sheet" {
  interface Sheets {
    "reset-password": ResetPasswordSheetDefinition;
    "logout-confirmation": LogoutConfirmationSheetDefinition;
    booking: BookingSheetDefinition;
    "cancel-booking-confirmation": CancelBookingConfirmationSheetDefinition;
    'select-bottom-sheet': SelectBottomSheetDefinition;
  }
}

export type { SheetDefinition };
