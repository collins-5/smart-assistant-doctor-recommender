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

const sheets: Record<string, React.ElementType> = {
  "reset-password": ResetPasswordBottomSheet,
  "logout-confirmation": LogoutConfirmationSheet,
  "unbookmark-confirmation": UnbookmarkConfirmationSheet,
  booking: BookingSheet,
  "cancel-booking-confirmation": CancelBookingConfirmationSheet, // ← Registered
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
    "booking": BookingSheetDefinition;
    "cancel-booking-confirmation": CancelBookingConfirmationSheetDefinition;
  }
}

export type { SheetDefinition };
