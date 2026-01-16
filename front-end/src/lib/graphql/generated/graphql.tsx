import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  Time: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AiChatMessageType = {
  __typename?: 'AIChatMessageType';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** True if message is from the patient, False if from AI */
  isFromUser: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type AppointmentInput = {
  doctorId: Scalars['Int']['input'];
  encounterMode: Scalars['String']['input'];
  startTime: Scalars['DateTime']['input'];
};

export type AppointmentType = {
  __typename?: 'AppointmentType';
  cancellationReason: Scalars['String']['output'];
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  cancelledBy?: Maybe<UserType>;
  cost: Scalars['Decimal']['output'];
  doctor?: Maybe<BookmarkedDoctorType>;
  encounterMode: CoreAppointmentEncounterModeChoices;
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  patient: PatientType;
  paymentCompleted: Scalars['Boolean']['output'];
  rastucId: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
  status: CoreAppointmentStatusChoices;
  /** Human readable status */
  statusDisplay?: Maybe<Scalars['String']['output']>;
};

export type AvailableSlotType = {
  __typename?: 'AvailableSlotType';
  doctorId?: Maybe<Scalars['Int']['output']>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isBooked?: Maybe<Scalars['Boolean']['output']>;
  isRecurring?: Maybe<Scalars['Boolean']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
};

export type BookAppointment = {
  __typename?: 'BookAppointment';
  appointment?: Maybe<AppointmentType>;
};

export type BookmarkDoctor = {
  __typename?: 'BookmarkDoctor';
  doctor?: Maybe<DoctorType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type BookmarkedDoctorType = {
  __typename?: 'BookmarkedDoctorType';
  appointmentSet: Array<AppointmentType>;
  availabilities: Array<DoctorAvailabilityType>;
  /** Get 30-minute time slots within a date range */
  availableSlots?: Maybe<Array<Maybe<AvailableSlotType>>>;
  bio: Scalars['String']['output'];
  clinicVisitPrice: Scalars['Decimal']['output'];
  country?: Maybe<CountryType>;
  county?: Maybe<CountyType>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  homecarePrice: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  insuarance: Array<InsuaranceType>;
  lastName: Scalars['String']['output'];
  primarySpecialty?: Maybe<SpecialtyType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  subSpecialties: Array<SpecialtyType>;
  takesPostpaidPayment: Scalars['Boolean']['output'];
  takesPrepaidPayment: Scalars['Boolean']['output'];
  teleconsultPrice: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  user: UserType;
};


export type BookmarkedDoctorTypeAvailableSlotsArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type CancelAppointment = {
  __typename?: 'CancelAppointment';
  appointment?: Maybe<AppointmentType>;
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** An enumeration. */
export enum CoreAppointmentEncounterModeChoices {
  /** Clinic Visit */
  Clinic = 'CLINIC',
  /** Homecare */
  Home = 'HOME',
  /** Teleconsult */
  Tele = 'TELE'
}

/** An enumeration. */
export enum CoreAppointmentStatusChoices {
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** Completed */
  Completed = 'COMPLETED',
  /** Ongoing */
  Ongoing = 'ONGOING',
  /** Upcoming */
  Upcoming = 'UPCOMING'
}

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CountyType = {
  __typename?: 'CountyType';
  country: CountryType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateDoctorAvailability = {
  __typename?: 'CreateDoctorAvailability';
  availability?: Maybe<DoctorAvailabilityType>;
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateDoctorAvailabilityInput = {
  /** 0=Monday, 1=Tuesday, ..., 6=Sunday */
  dayOfWeek: Scalars['Int']['input'];
  doctorId?: InputMaybe<Scalars['Int']['input']>;
  /** When this availability starts */
  effectiveDate: Scalars['Date']['input'];
  /** End time of day (e.g., 17:00:00) */
  endTimeOfDay: Scalars['Time']['input'];
  /** Optional end date for recurring availability */
  recurrenceEndDate?: InputMaybe<Scalars['Date']['input']>;
  /** Start time of day (e.g., 09:00:00) */
  startTimeOfDay: Scalars['Time']['input'];
};

export type CreatePatientProfile = {
  __typename?: 'CreatePatientProfile';
  error?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<PatientType>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type CreatePatientProfileInput = {
  countryId?: InputMaybe<Scalars['Int']['input']>;
  countyId?: InputMaybe<Scalars['Int']['input']>;
  dateOfBirth: Scalars['Date']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteDoctorAvailability = {
  __typename?: 'DeleteDoctorAvailability';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type DoctorAvailabilityType = {
  __typename?: 'DoctorAvailabilityType';
  doctor: BookmarkedDoctorType;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  /** End time of day for recurring block (e.g., 17:00:00) */
  endTimeOfDay: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  /** True if an appointment overlaps this slot */
  isBooked?: Maybe<Scalars['Boolean']['output']>;
  isRecurring: Scalars['Boolean']['output'];
  /** 0=Monday ... 6=Sunday — only used if is_recurring=True */
  recurrenceDayOfWeek?: Maybe<Scalars['Int']['output']>;
  recurrenceEndDate?: Maybe<Scalars['Date']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  /** Start time of day for recurring block (e.g., 09:00:00) */
  startTimeOfDay: Scalars['Time']['output'];
};

export type DoctorType = {
  __typename?: 'DoctorType';
  appointmentSet: Array<AppointmentType>;
  availabilities: Array<DoctorAvailabilityType>;
  /** Get 30-minute time slots within a date range */
  availableSlots?: Maybe<Array<Maybe<AvailableSlotType>>>;
  bio: Scalars['String']['output'];
  clinicVisitPrice: Scalars['Decimal']['output'];
  country?: Maybe<CountryType>;
  county?: Maybe<CountyType>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  homecarePrice: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
  insuarance: Array<InsuaranceType>;
  lastName: Scalars['String']['output'];
  primarySpecialty?: Maybe<SpecialtyType>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  subSpecialties: Array<SpecialtyType>;
  takesPostpaidPayment: Scalars['Boolean']['output'];
  takesPrepaidPayment: Scalars['Boolean']['output'];
  teleconsultPrice: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  user: UserType;
};


export type DoctorTypeAvailableSlotsArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type EditProfile = {
  __typename?: 'EditProfile';
  error?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<PatientType>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type EditProfileInput = {
  countryId?: InputMaybe<Scalars['Int']['input']>;
  countyId?: InputMaybe<Scalars['Int']['input']>;
  dateOfBirth?: InputMaybe<Scalars['Date']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type GoogleSignIn = {
  __typename?: 'GoogleSignIn';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type InsuaranceType = {
  __typename?: 'InsuaranceType';
  id: Scalars['ID']['output'];
  insuarance: Array<BookmarkedDoctorType>;
  logo?: Maybe<Scalars['String']['output']>;
  /** Full URL to the insurance logo */
  logoUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  bookAppointment?: Maybe<BookAppointment>;
  bookmarkDoctor?: Maybe<BookmarkDoctor>;
  cancelAppointment?: Maybe<CancelAppointment>;
  createDoctorAvailability?: Maybe<CreateDoctorAvailability>;
  createPatientProfile?: Maybe<CreatePatientProfile>;
  deleteDoctorAvailability?: Maybe<DeleteDoctorAvailability>;
  editProfile?: Maybe<EditProfile>;
  googleSignIn?: Maybe<GoogleSignIn>;
  refreshToken?: Maybe<Refresh>;
  removeProfilePicture?: Maybe<RemoveProfilePicture>;
  sendAiChatMessage?: Maybe<SendAiChatMessage>;
  signIn?: Maybe<SignIn>;
  signUp?: Maybe<SignUp>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  unbookmarkDoctor?: Maybe<UnbookmarkDoctor>;
  uploadInsuranceLogo?: Maybe<UploadInsuranceLogo>;
  uploadProfilePicture?: Maybe<UploadProfilePicture>;
  verifyToken?: Maybe<Verify>;
};


export type MutationBookAppointmentArgs = {
  bookingArgs: AppointmentInput;
};


export type MutationBookmarkDoctorArgs = {
  doctorId: Scalars['Int']['input'];
};


export type MutationCancelAppointmentArgs = {
  appointmentId: Scalars['Int']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateDoctorAvailabilityArgs = {
  input: CreateDoctorAvailabilityInput;
};


export type MutationCreatePatientProfileArgs = {
  input: CreatePatientProfileInput;
};


export type MutationDeleteDoctorAvailabilityArgs = {
  availabilityId: Scalars['Int']['input'];
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationGoogleSignInArgs = {
  idTokenStr: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendAiChatMessageArgs = {
  isFromUser?: InputMaybe<Scalars['Boolean']['input']>;
  text: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  emailOrPhoneNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationTokenAuthArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUnbookmarkDoctorArgs = {
  doctorId: Scalars['Int']['input'];
};


export type MutationUploadInsuranceLogoArgs = {
  file: Scalars['Upload']['input'];
  insuranceId: Scalars['Int']['input'];
};


export type MutationUploadProfilePictureArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

/** Obtain JSON Web Token mutation */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type PatientType = {
  __typename?: 'PatientType';
  aiChatMessages: Array<AiChatMessageType>;
  appointments: Array<AppointmentType>;
  country?: Maybe<CountryType>;
  county?: Maybe<CountyType>;
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  middleName: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  user: UserType;
};

export type Query = {
  __typename?: 'Query';
  aiChatMessages?: Maybe<Array<Maybe<AiChatMessageType>>>;
  appointments?: Maybe<Array<Maybe<AppointmentType>>>;
  bookmarkedDoctors?: Maybe<Array<Maybe<BookmarkedDoctorType>>>;
  counties?: Maybe<Array<Maybe<CountyType>>>;
  countries?: Maybe<Array<Maybe<CountryType>>>;
  doctor?: Maybe<DoctorType>;
  doctorAvailableSlots?: Maybe<Array<Maybe<AvailableSlotType>>>;
  doctors?: Maybe<Array<Maybe<DoctorType>>>;
  hello?: Maybe<Scalars['String']['output']>;
  insuarances?: Maybe<Array<Maybe<InsuaranceType>>>;
  me?: Maybe<UserType>;
  patients?: Maybe<Array<Maybe<PatientType>>>;
  specialties?: Maybe<Array<Maybe<SpecialtyType>>>;
};


export type QueryAppointmentsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCountiesArgs = {
  countryId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDoctorArgs = {
  id: Scalars['Int']['input'];
};


export type QueryDoctorAvailableSlotsArgs = {
  doctorId: Scalars['Int']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
};

export type RemoveProfilePicture = {
  __typename?: 'RemoveProfilePicture';
  error?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<PatientType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SendAiChatMessage = {
  __typename?: 'SendAIChatMessage';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<AiChatMessageType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type SignIn = {
  __typename?: 'SignIn';
  jwtToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export type SignUp = {
  __typename?: 'SignUp';
  error?: Maybe<Scalars['String']['output']>;
  jwtToken?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  user?: Maybe<UserType>;
};

export type SpecialtyType = {
  __typename?: 'SpecialtyType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  primaryDoctors: Array<BookmarkedDoctorType>;
  subspecialtyDoctors: Array<BookmarkedDoctorType>;
};

export type Subscription = {
  __typename?: 'Subscription';
  retrieveNewNotifications?: Maybe<NotificationType>;
};


export type SubscriptionRetrieveNewNotificationsArgs = {
  jwtToken: Scalars['String']['input'];
  patientId: Scalars['Int']['input'];
};

export type UnbookmarkDoctor = {
  __typename?: 'UnbookmarkDoctor';
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type UploadInsuranceLogo = {
  __typename?: 'UploadInsuranceLogo';
  error?: Maybe<Scalars['String']['output']>;
  insurance?: Maybe<InsuaranceType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type UploadProfilePicture = {
  __typename?: 'UploadProfilePicture';
  error?: Maybe<Scalars['String']['output']>;
  patient?: Maybe<PatientType>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type UserType = {
  __typename?: 'UserType';
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  patient?: Maybe<PatientType>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
  username: Scalars['String']['output'];
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar']['output'];
};

export type SendAiChatMessageMutationVariables = Exact<{
  text: Scalars['String']['input'];
  isFromUser?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type SendAiChatMessageMutation = { __typename?: 'Mutation', sendAiChatMessage?: { __typename?: 'SendAIChatMessage', success?: boolean | null, error?: string | null, message?: { __typename?: 'AIChatMessageType', id: string, text: string, isFromUser: boolean, createdAt: any } | null } | null };

export type CancelAppointmentMutationVariables = Exact<{
  appointmentId: Scalars['Int']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelAppointmentMutation = { __typename?: 'Mutation', cancelAppointment?: { __typename?: 'CancelAppointment', success?: boolean | null, error?: string | null, appointment?: { __typename?: 'AppointmentType', id: string, status: CoreAppointmentStatusChoices, statusDisplay?: string | null, cancelledAt?: any | null, cancellationReason: string, doctor?: { __typename?: 'BookmarkedDoctorType', fullName: string } | null } | null } | null };

export type CreatePatientProfileMutationVariables = Exact<{
  input: CreatePatientProfileInput;
}>;


export type CreatePatientProfileMutation = { __typename?: 'Mutation', createPatientProfile?: { __typename?: 'CreatePatientProfile', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string } | null, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile?: { __typename?: 'EditProfile', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string } | null, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

export type GoogleSignInMutationVariables = Exact<{
  idTokenStr: Scalars['String']['input'];
}>;


export type GoogleSignInMutation = { __typename?: 'Mutation', googleSignIn?: { __typename?: 'GoogleSignIn', success?: boolean | null, token?: string | null, error?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, firstName: string, lastName: string, phoneNumber?: string | null, isActive: boolean } | null } | null };

export type RemoveProfilePictureMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveProfilePictureMutation = { __typename?: 'Mutation', removeProfilePicture?: { __typename?: 'RemoveProfilePicture', success?: boolean | null, error?: string | null, patient?: { __typename?: 'PatientType', id: string, profilePictureUrl?: string | null } | null } | null };

export type SignInMutationVariables = Exact<{
  emailOrPhoneNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'SignIn', jwtToken?: string | null, user?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, gender: string, dateOfBirth?: any | null, email?: string | null, phoneNumber?: string | null } | null } | null } | null };

export type SignUpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  email: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'SignUp', success?: boolean | null, error?: string | null, jwtToken?: string | null, user?: { __typename?: 'UserType', id: string, username: string, email?: string | null, phoneNumber?: string | null } | null } | null };

export type UploadProfilePictureMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type UploadProfilePictureMutation = { __typename?: 'Mutation', uploadProfilePicture?: { __typename?: 'UploadProfilePicture', success?: boolean | null, error?: string | null, patient?: { __typename?: 'PatientType', id: string, profilePictureUrl?: string | null } | null } | null };

export type VerifyTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyTokenMutation = { __typename?: 'Mutation', verifyToken?: { __typename?: 'Verify', payload: any } | null };

export type BookAppointmentMutationVariables = Exact<{
  bookingArgs: AppointmentInput;
}>;


export type BookAppointmentMutation = { __typename?: 'Mutation', bookAppointment?: { __typename?: 'BookAppointment', appointment?: { __typename?: 'AppointmentType', id: string, rastucId: string, startTime: any, encounterMode: CoreAppointmentEncounterModeChoices, cost: any, doctor?: { __typename?: 'BookmarkedDoctorType', id: string, fullName: string, title: string, primarySpecialty?: { __typename?: 'SpecialtyType', name: string } | null } | null } | null } | null };

export type GetAiChatMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAiChatMessagesQuery = { __typename?: 'Query', aiChatMessages?: Array<{ __typename?: 'AIChatMessageType', id: string, text: string, isFromUser: boolean, createdAt: any } | null> | null };

export type BookmarkDoctorMutationVariables = Exact<{
  doctorId: Scalars['Int']['input'];
}>;


export type BookmarkDoctorMutation = { __typename?: 'Mutation', bookmarkDoctor?: { __typename?: 'BookmarkDoctor', success?: boolean | null, doctor?: { __typename?: 'DoctorType', id: string, fullName: string } | null } | null };

export type GetBookmarkedDoctorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookmarkedDoctorsQuery = { __typename?: 'Query', bookmarkedDoctors?: Array<{ __typename?: 'BookmarkedDoctorType', id: string, title: string, firstName: string, lastName: string, fullName: string, profilePictureUrl?: string | null, teleconsultPrice: any, clinicVisitPrice: any, homecarePrice: any, primarySpecialty?: { __typename?: 'SpecialtyType', id: string, name: string } | null } | null> | null };

export type GetDoctorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoctorsQuery = { __typename?: 'Query', doctors?: Array<{ __typename?: 'DoctorType', id: string, title: string, firstName: string, lastName: string, fullName: string, profilePictureUrl?: string | null, teleconsultPrice: any, clinicVisitPrice: any, homecarePrice: any, takesPrepaidPayment: boolean, takesPostpaidPayment: boolean, primarySpecialty?: { __typename?: 'SpecialtyType', id: string, name: string } | null, subSpecialties: Array<{ __typename?: 'SpecialtyType', id: string, name: string }>, insuarance: Array<{ __typename?: 'InsuaranceType', id: string, name: string, logoUrl?: string | null }>, county?: { __typename?: 'CountyType', name: string, country: { __typename?: 'CountryType', name: string } } | null } | null> | null };

export type GetDoctorWithAvailableSlotsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
  date: Scalars['Date']['input'];
}>;


export type GetDoctorWithAvailableSlotsQuery = { __typename?: 'Query', doctor?: { __typename?: 'DoctorType', id: string, title: string, bio: string, firstName: string, lastName: string, fullName: string, profilePictureUrl?: string | null, takesPrepaidPayment: boolean, takesPostpaidPayment: boolean, teleconsultPrice: any, clinicVisitPrice: any, homecarePrice: any, primarySpecialty?: { __typename?: 'SpecialtyType', id: string, name: string } | null, subSpecialties: Array<{ __typename?: 'SpecialtyType', id: string, name: string }>, insuarance: Array<{ __typename?: 'InsuaranceType', id: string, name: string, logoUrl?: string | null }>, user: { __typename?: 'UserType', phoneNumber?: string | null, email?: string | null }, county?: { __typename?: 'CountyType', name: string, country: { __typename?: 'CountryType', name: string } } | null, availableSlots?: Array<{ __typename?: 'AvailableSlotType', id?: string | null, doctorId?: number | null, startTime?: any | null, endTime?: any | null, isBooked?: boolean | null, isRecurring?: boolean | null } | null> | null } | null };

export type GetMyAppointmentsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMyAppointmentsQuery = { __typename?: 'Query', appointments?: Array<{ __typename?: 'AppointmentType', id: string, startTime: any, endTime: any, encounterMode: CoreAppointmentEncounterModeChoices, cost: any, paymentCompleted: boolean, rastucId: string, status: CoreAppointmentStatusChoices, statusDisplay?: string | null, doctor?: { __typename?: 'BookmarkedDoctorType', id: string, fullName: string, title: string, primarySpecialty?: { __typename?: 'SpecialtyType', name: string } | null } | null } | null> | null };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', me?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, email?: string | null, phoneNumber?: string | null, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

export type GetSpecialtiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpecialtiesQuery = { __typename?: 'Query', specialties?: Array<{ __typename?: 'SpecialtyType', id: string, name: string } | null> | null };

export type UnbookmarkDoctorMutationVariables = Exact<{
  doctorId: Scalars['Int']['input'];
}>;


export type UnbookmarkDoctorMutation = { __typename?: 'Mutation', unbookmarkDoctor?: { __typename?: 'UnbookmarkDoctor', success?: boolean | null } | null };

export type RetrieveNotificationsSubscriptionVariables = Exact<{
  patientId: Scalars['Int']['input'];
  jwtToken: Scalars['String']['input'];
}>;


export type RetrieveNotificationsSubscription = { __typename?: 'Subscription', retrieveNewNotifications?: { __typename?: 'NotificationType', id: number, title: string, description: string, createdAt: any, isRead: boolean } | null };


export const SendAiChatMessageDocument = gql`
    mutation SendAIChatMessage($text: String!, $isFromUser: Boolean) {
  sendAiChatMessage(text: $text, isFromUser: $isFromUser) {
    message {
      id
      text
      isFromUser
      createdAt
    }
    success
    error
  }
}
    `;
export type SendAiChatMessageMutationFn = Apollo.MutationFunction<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>;

/**
 * __useSendAiChatMessageMutation__
 *
 * To run a mutation, you first call `useSendAiChatMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendAiChatMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendAiChatMessageMutation, { data, loading, error }] = useSendAiChatMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      isFromUser: // value for 'isFromUser'
 *   },
 * });
 */
export function useSendAiChatMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>(SendAiChatMessageDocument, options);
      }
export type SendAiChatMessageMutationHookResult = ReturnType<typeof useSendAiChatMessageMutation>;
export type SendAiChatMessageMutationResult = Apollo.MutationResult<SendAiChatMessageMutation>;
export type SendAiChatMessageMutationOptions = Apollo.BaseMutationOptions<SendAiChatMessageMutation, SendAiChatMessageMutationVariables>;
export const CancelAppointmentDocument = gql`
    mutation CancelAppointment($appointmentId: Int!, $reason: String) {
  cancelAppointment(appointmentId: $appointmentId, reason: $reason) {
    success
    error
    appointment {
      id
      status
      statusDisplay
      cancelledAt
      cancellationReason
      doctor {
        fullName
      }
    }
  }
}
    `;
export type CancelAppointmentMutationFn = Apollo.MutationFunction<CancelAppointmentMutation, CancelAppointmentMutationVariables>;

/**
 * __useCancelAppointmentMutation__
 *
 * To run a mutation, you first call `useCancelAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelAppointmentMutation, { data, loading, error }] = useCancelAppointmentMutation({
 *   variables: {
 *      appointmentId: // value for 'appointmentId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CancelAppointmentMutation, CancelAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelAppointmentMutation, CancelAppointmentMutationVariables>(CancelAppointmentDocument, options);
      }
export type CancelAppointmentMutationHookResult = ReturnType<typeof useCancelAppointmentMutation>;
export type CancelAppointmentMutationResult = Apollo.MutationResult<CancelAppointmentMutation>;
export type CancelAppointmentMutationOptions = Apollo.BaseMutationOptions<CancelAppointmentMutation, CancelAppointmentMutationVariables>;
export const CreatePatientProfileDocument = gql`
    mutation CreatePatientProfile($input: CreatePatientProfileInput!) {
  createPatientProfile(input: $input) {
    success
    error
    user {
      id
      email
      phoneNumber
      firstName
      lastName
    }
    patient {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      gender
      country {
        id
        name
      }
      county {
        id
        name
      }
      profilePictureUrl
    }
  }
}
    `;
export type CreatePatientProfileMutationFn = Apollo.MutationFunction<CreatePatientProfileMutation, CreatePatientProfileMutationVariables>;

/**
 * __useCreatePatientProfileMutation__
 *
 * To run a mutation, you first call `useCreatePatientProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePatientProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPatientProfileMutation, { data, loading, error }] = useCreatePatientProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePatientProfileMutation(baseOptions?: Apollo.MutationHookOptions<CreatePatientProfileMutation, CreatePatientProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePatientProfileMutation, CreatePatientProfileMutationVariables>(CreatePatientProfileDocument, options);
      }
export type CreatePatientProfileMutationHookResult = ReturnType<typeof useCreatePatientProfileMutation>;
export type CreatePatientProfileMutationResult = Apollo.MutationResult<CreatePatientProfileMutation>;
export type CreatePatientProfileMutationOptions = Apollo.BaseMutationOptions<CreatePatientProfileMutation, CreatePatientProfileMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    success
    error
    user {
      id
      email
      phoneNumber
      firstName
      lastName
    }
    patient {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      gender
      country {
        id
        name
      }
      county {
        id
        name
      }
      profilePictureUrl
    }
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const GoogleSignInDocument = gql`
    mutation GoogleSignIn($idTokenStr: String!) {
  googleSignIn(idTokenStr: $idTokenStr) {
    success
    token
    error
    user {
      id
      username
      email
      firstName
      lastName
      phoneNumber
      isActive
    }
  }
}
    `;
export type GoogleSignInMutationFn = Apollo.MutationFunction<GoogleSignInMutation, GoogleSignInMutationVariables>;

/**
 * __useGoogleSignInMutation__
 *
 * To run a mutation, you first call `useGoogleSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleSignInMutation, { data, loading, error }] = useGoogleSignInMutation({
 *   variables: {
 *      idTokenStr: // value for 'idTokenStr'
 *   },
 * });
 */
export function useGoogleSignInMutation(baseOptions?: Apollo.MutationHookOptions<GoogleSignInMutation, GoogleSignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleSignInMutation, GoogleSignInMutationVariables>(GoogleSignInDocument, options);
      }
export type GoogleSignInMutationHookResult = ReturnType<typeof useGoogleSignInMutation>;
export type GoogleSignInMutationResult = Apollo.MutationResult<GoogleSignInMutation>;
export type GoogleSignInMutationOptions = Apollo.BaseMutationOptions<GoogleSignInMutation, GoogleSignInMutationVariables>;
export const RemoveProfilePictureDocument = gql`
    mutation RemoveProfilePicture {
  removeProfilePicture {
    success
    error
    patient {
      id
      profilePictureUrl
    }
  }
}
    `;
export type RemoveProfilePictureMutationFn = Apollo.MutationFunction<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>;

/**
 * __useRemoveProfilePictureMutation__
 *
 * To run a mutation, you first call `useRemoveProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProfilePictureMutation, { data, loading, error }] = useRemoveProfilePictureMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>(RemoveProfilePictureDocument, options);
      }
export type RemoveProfilePictureMutationHookResult = ReturnType<typeof useRemoveProfilePictureMutation>;
export type RemoveProfilePictureMutationResult = Apollo.MutationResult<RemoveProfilePictureMutation>;
export type RemoveProfilePictureMutationOptions = Apollo.BaseMutationOptions<RemoveProfilePictureMutation, RemoveProfilePictureMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($emailOrPhoneNumber: String!, $password: String!) {
  signIn(emailOrPhoneNumber: $emailOrPhoneNumber, password: $password) {
    jwtToken
    user {
      id
      email
      phoneNumber
      firstName
      lastName
      patient {
        id
        firstName
        lastName
        gender
        dateOfBirth
        email
        phoneNumber
      }
    }
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      emailOrPhoneNumber: // value for 'emailOrPhoneNumber'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($username: String!, $email: String!, $phoneNumber: String!, $password: String!) {
  signUp(
    username: $username
    email: $email
    phoneNumber: $phoneNumber
    password: $password
  ) {
    success
    error
    jwtToken
    user {
      id
      username
      email
      phoneNumber
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      phoneNumber: // value for 'phoneNumber'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const UploadProfilePictureDocument = gql`
    mutation UploadProfilePicture($file: Upload!) {
  uploadProfilePicture(file: $file) {
    success
    error
    patient {
      id
      profilePictureUrl
    }
  }
}
    `;
export type UploadProfilePictureMutationFn = Apollo.MutationFunction<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>;

/**
 * __useUploadProfilePictureMutation__
 *
 * To run a mutation, you first call `useUploadProfilePictureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadProfilePictureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadProfilePictureMutation, { data, loading, error }] = useUploadProfilePictureMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadProfilePictureMutation(baseOptions?: Apollo.MutationHookOptions<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>(UploadProfilePictureDocument, options);
      }
export type UploadProfilePictureMutationHookResult = ReturnType<typeof useUploadProfilePictureMutation>;
export type UploadProfilePictureMutationResult = Apollo.MutationResult<UploadProfilePictureMutation>;
export type UploadProfilePictureMutationOptions = Apollo.BaseMutationOptions<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>;
export const VerifyTokenDocument = gql`
    mutation VerifyToken($token: String!) {
  verifyToken(token: $token) {
    payload
  }
}
    `;
export type VerifyTokenMutationFn = Apollo.MutationFunction<VerifyTokenMutation, VerifyTokenMutationVariables>;

/**
 * __useVerifyTokenMutation__
 *
 * To run a mutation, you first call `useVerifyTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyTokenMutation, { data, loading, error }] = useVerifyTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyTokenMutation(baseOptions?: Apollo.MutationHookOptions<VerifyTokenMutation, VerifyTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyTokenMutation, VerifyTokenMutationVariables>(VerifyTokenDocument, options);
      }
export type VerifyTokenMutationHookResult = ReturnType<typeof useVerifyTokenMutation>;
export type VerifyTokenMutationResult = Apollo.MutationResult<VerifyTokenMutation>;
export type VerifyTokenMutationOptions = Apollo.BaseMutationOptions<VerifyTokenMutation, VerifyTokenMutationVariables>;
export const BookAppointmentDocument = gql`
    mutation BookAppointment($bookingArgs: AppointmentInput!) {
  bookAppointment(bookingArgs: $bookingArgs) {
    appointment {
      id
      rastucId
      startTime
      encounterMode
      cost
      doctor {
        id
        fullName
        title
        primarySpecialty {
          name
        }
      }
    }
  }
}
    `;
export type BookAppointmentMutationFn = Apollo.MutationFunction<BookAppointmentMutation, BookAppointmentMutationVariables>;

/**
 * __useBookAppointmentMutation__
 *
 * To run a mutation, you first call `useBookAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookAppointmentMutation, { data, loading, error }] = useBookAppointmentMutation({
 *   variables: {
 *      bookingArgs: // value for 'bookingArgs'
 *   },
 * });
 */
export function useBookAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<BookAppointmentMutation, BookAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookAppointmentMutation, BookAppointmentMutationVariables>(BookAppointmentDocument, options);
      }
export type BookAppointmentMutationHookResult = ReturnType<typeof useBookAppointmentMutation>;
export type BookAppointmentMutationResult = Apollo.MutationResult<BookAppointmentMutation>;
export type BookAppointmentMutationOptions = Apollo.BaseMutationOptions<BookAppointmentMutation, BookAppointmentMutationVariables>;
export const GetAiChatMessagesDocument = gql`
    query GetAIChatMessages {
  aiChatMessages {
    id
    text
    isFromUser
    createdAt
  }
}
    `;

/**
 * __useGetAiChatMessagesQuery__
 *
 * To run a query within a React component, call `useGetAiChatMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAiChatMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAiChatMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAiChatMessagesQuery(baseOptions?: Apollo.QueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
      }
export function useGetAiChatMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
        }
export function useGetAiChatMessagesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>(GetAiChatMessagesDocument, options);
        }
export type GetAiChatMessagesQueryHookResult = ReturnType<typeof useGetAiChatMessagesQuery>;
export type GetAiChatMessagesLazyQueryHookResult = ReturnType<typeof useGetAiChatMessagesLazyQuery>;
export type GetAiChatMessagesSuspenseQueryHookResult = ReturnType<typeof useGetAiChatMessagesSuspenseQuery>;
export type GetAiChatMessagesQueryResult = Apollo.QueryResult<GetAiChatMessagesQuery, GetAiChatMessagesQueryVariables>;
export const BookmarkDoctorDocument = gql`
    mutation BookmarkDoctor($doctorId: Int!) {
  bookmarkDoctor(doctorId: $doctorId) {
    success
    doctor {
      id
      fullName
    }
  }
}
    `;
export type BookmarkDoctorMutationFn = Apollo.MutationFunction<BookmarkDoctorMutation, BookmarkDoctorMutationVariables>;

/**
 * __useBookmarkDoctorMutation__
 *
 * To run a mutation, you first call `useBookmarkDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBookmarkDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bookmarkDoctorMutation, { data, loading, error }] = useBookmarkDoctorMutation({
 *   variables: {
 *      doctorId: // value for 'doctorId'
 *   },
 * });
 */
export function useBookmarkDoctorMutation(baseOptions?: Apollo.MutationHookOptions<BookmarkDoctorMutation, BookmarkDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BookmarkDoctorMutation, BookmarkDoctorMutationVariables>(BookmarkDoctorDocument, options);
      }
export type BookmarkDoctorMutationHookResult = ReturnType<typeof useBookmarkDoctorMutation>;
export type BookmarkDoctorMutationResult = Apollo.MutationResult<BookmarkDoctorMutation>;
export type BookmarkDoctorMutationOptions = Apollo.BaseMutationOptions<BookmarkDoctorMutation, BookmarkDoctorMutationVariables>;
export const GetBookmarkedDoctorsDocument = gql`
    query GetBookmarkedDoctors {
  bookmarkedDoctors {
    id
    title
    firstName
    lastName
    fullName
    profilePictureUrl
    primarySpecialty {
      id
      name
    }
    teleconsultPrice
    clinicVisitPrice
    homecarePrice
  }
}
    `;

/**
 * __useGetBookmarkedDoctorsQuery__
 *
 * To run a query within a React component, call `useGetBookmarkedDoctorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBookmarkedDoctorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBookmarkedDoctorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBookmarkedDoctorsQuery(baseOptions?: Apollo.QueryHookOptions<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>(GetBookmarkedDoctorsDocument, options);
      }
export function useGetBookmarkedDoctorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>(GetBookmarkedDoctorsDocument, options);
        }
export function useGetBookmarkedDoctorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>(GetBookmarkedDoctorsDocument, options);
        }
export type GetBookmarkedDoctorsQueryHookResult = ReturnType<typeof useGetBookmarkedDoctorsQuery>;
export type GetBookmarkedDoctorsLazyQueryHookResult = ReturnType<typeof useGetBookmarkedDoctorsLazyQuery>;
export type GetBookmarkedDoctorsSuspenseQueryHookResult = ReturnType<typeof useGetBookmarkedDoctorsSuspenseQuery>;
export type GetBookmarkedDoctorsQueryResult = Apollo.QueryResult<GetBookmarkedDoctorsQuery, GetBookmarkedDoctorsQueryVariables>;
export const GetDoctorsDocument = gql`
    query GetDoctors {
  doctors {
    id
    title
    firstName
    lastName
    fullName
    profilePictureUrl
    primarySpecialty {
      id
      name
    }
    subSpecialties {
      id
      name
    }
    teleconsultPrice
    clinicVisitPrice
    homecarePrice
    takesPrepaidPayment
    takesPostpaidPayment
    insuarance {
      id
      name
      logoUrl
    }
    county {
      name
      country {
        name
      }
    }
  }
}
    `;

/**
 * __useGetDoctorsQuery__
 *
 * To run a query within a React component, call `useGetDoctorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoctorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoctorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDoctorsQuery(baseOptions?: Apollo.QueryHookOptions<GetDoctorsQuery, GetDoctorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(GetDoctorsDocument, options);
      }
export function useGetDoctorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoctorsQuery, GetDoctorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(GetDoctorsDocument, options);
        }
export function useGetDoctorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDoctorsQuery, GetDoctorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDoctorsQuery, GetDoctorsQueryVariables>(GetDoctorsDocument, options);
        }
export type GetDoctorsQueryHookResult = ReturnType<typeof useGetDoctorsQuery>;
export type GetDoctorsLazyQueryHookResult = ReturnType<typeof useGetDoctorsLazyQuery>;
export type GetDoctorsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorsSuspenseQuery>;
export type GetDoctorsQueryResult = Apollo.QueryResult<GetDoctorsQuery, GetDoctorsQueryVariables>;
export const GetDoctorWithAvailableSlotsDocument = gql`
    query GetDoctorWithAvailableSlots($id: Int!, $date: Date!) {
  doctor(id: $id) {
    id
    title
    bio
    firstName
    lastName
    fullName
    profilePictureUrl
    takesPrepaidPayment
    takesPostpaidPayment
    teleconsultPrice
    clinicVisitPrice
    homecarePrice
    primarySpecialty {
      id
      name
    }
    subSpecialties {
      id
      name
    }
    insuarance {
      id
      name
      logoUrl
    }
    user {
      phoneNumber
      email
    }
    county {
      name
      country {
        name
      }
    }
    availableSlots(startDate: $date, endDate: $date) {
      id
      doctorId
      startTime
      endTime
      isBooked
      isRecurring
    }
  }
}
    `;

/**
 * __useGetDoctorWithAvailableSlotsQuery__
 *
 * To run a query within a React component, call `useGetDoctorWithAvailableSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDoctorWithAvailableSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDoctorWithAvailableSlotsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetDoctorWithAvailableSlotsQuery(baseOptions: Apollo.QueryHookOptions<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables> & ({ variables: GetDoctorWithAvailableSlotsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>(GetDoctorWithAvailableSlotsDocument, options);
      }
export function useGetDoctorWithAvailableSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>(GetDoctorWithAvailableSlotsDocument, options);
        }
export function useGetDoctorWithAvailableSlotsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>(GetDoctorWithAvailableSlotsDocument, options);
        }
export type GetDoctorWithAvailableSlotsQueryHookResult = ReturnType<typeof useGetDoctorWithAvailableSlotsQuery>;
export type GetDoctorWithAvailableSlotsLazyQueryHookResult = ReturnType<typeof useGetDoctorWithAvailableSlotsLazyQuery>;
export type GetDoctorWithAvailableSlotsSuspenseQueryHookResult = ReturnType<typeof useGetDoctorWithAvailableSlotsSuspenseQuery>;
export type GetDoctorWithAvailableSlotsQueryResult = Apollo.QueryResult<GetDoctorWithAvailableSlotsQuery, GetDoctorWithAvailableSlotsQueryVariables>;
export const GetMyAppointmentsDocument = gql`
    query GetMyAppointments($status: String) {
  appointments(status: $status) {
    id
    startTime
    endTime
    encounterMode
    cost
    paymentCompleted
    rastucId
    status
    statusDisplay
    doctor {
      id
      fullName
      title
      primarySpecialty {
        name
      }
    }
  }
}
    `;

/**
 * __useGetMyAppointmentsQuery__
 *
 * To run a query within a React component, call `useGetMyAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyAppointmentsQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetMyAppointmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
      }
export function useGetMyAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
        }
export function useGetMyAppointmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
        }
export type GetMyAppointmentsQueryHookResult = ReturnType<typeof useGetMyAppointmentsQuery>;
export type GetMyAppointmentsLazyQueryHookResult = ReturnType<typeof useGetMyAppointmentsLazyQuery>;
export type GetMyAppointmentsSuspenseQueryHookResult = ReturnType<typeof useGetMyAppointmentsSuspenseQuery>;
export type GetMyAppointmentsQueryResult = Apollo.QueryResult<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>;
export const ProfileDocument = gql`
    query Profile {
  me {
    id
    email
    phoneNumber
    firstName
    lastName
    patient {
      id
      firstName
      lastName
      middleName
      dateOfBirth
      gender
      email
      phoneNumber
      profilePictureUrl
      country {
        id
        name
      }
      county {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useProfileQuery__
 *
 * To run a query within a React component, call `useProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useProfileQuery(baseOptions?: Apollo.QueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
      }
export function useProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export function useProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProfileQuery, ProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProfileQuery, ProfileQueryVariables>(ProfileDocument, options);
        }
export type ProfileQueryHookResult = ReturnType<typeof useProfileQuery>;
export type ProfileLazyQueryHookResult = ReturnType<typeof useProfileLazyQuery>;
export type ProfileSuspenseQueryHookResult = ReturnType<typeof useProfileSuspenseQuery>;
export type ProfileQueryResult = Apollo.QueryResult<ProfileQuery, ProfileQueryVariables>;
export const GetSpecialtiesDocument = gql`
    query GetSpecialties {
  specialties {
    id
    name
  }
}
    `;

/**
 * __useGetSpecialtiesQuery__
 *
 * To run a query within a React component, call `useGetSpecialtiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpecialtiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpecialtiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSpecialtiesQuery(baseOptions?: Apollo.QueryHookOptions<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>(GetSpecialtiesDocument, options);
      }
export function useGetSpecialtiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>(GetSpecialtiesDocument, options);
        }
export function useGetSpecialtiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>(GetSpecialtiesDocument, options);
        }
export type GetSpecialtiesQueryHookResult = ReturnType<typeof useGetSpecialtiesQuery>;
export type GetSpecialtiesLazyQueryHookResult = ReturnType<typeof useGetSpecialtiesLazyQuery>;
export type GetSpecialtiesSuspenseQueryHookResult = ReturnType<typeof useGetSpecialtiesSuspenseQuery>;
export type GetSpecialtiesQueryResult = Apollo.QueryResult<GetSpecialtiesQuery, GetSpecialtiesQueryVariables>;
export const UnbookmarkDoctorDocument = gql`
    mutation UnbookmarkDoctor($doctorId: Int!) {
  unbookmarkDoctor(doctorId: $doctorId) {
    success
  }
}
    `;
export type UnbookmarkDoctorMutationFn = Apollo.MutationFunction<UnbookmarkDoctorMutation, UnbookmarkDoctorMutationVariables>;

/**
 * __useUnbookmarkDoctorMutation__
 *
 * To run a mutation, you first call `useUnbookmarkDoctorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnbookmarkDoctorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unbookmarkDoctorMutation, { data, loading, error }] = useUnbookmarkDoctorMutation({
 *   variables: {
 *      doctorId: // value for 'doctorId'
 *   },
 * });
 */
export function useUnbookmarkDoctorMutation(baseOptions?: Apollo.MutationHookOptions<UnbookmarkDoctorMutation, UnbookmarkDoctorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnbookmarkDoctorMutation, UnbookmarkDoctorMutationVariables>(UnbookmarkDoctorDocument, options);
      }
export type UnbookmarkDoctorMutationHookResult = ReturnType<typeof useUnbookmarkDoctorMutation>;
export type UnbookmarkDoctorMutationResult = Apollo.MutationResult<UnbookmarkDoctorMutation>;
export type UnbookmarkDoctorMutationOptions = Apollo.BaseMutationOptions<UnbookmarkDoctorMutation, UnbookmarkDoctorMutationVariables>;
export const RetrieveNotificationsDocument = gql`
    subscription RetrieveNotifications($patientId: Int!, $jwtToken: String!) {
  retrieveNewNotifications(patientId: $patientId, jwtToken: $jwtToken) {
    id
    title
    description
    createdAt
    isRead
  }
}
    `;

/**
 * __useRetrieveNotificationsSubscription__
 *
 * To run a query within a React component, call `useRetrieveNotificationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRetrieveNotificationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRetrieveNotificationsSubscription({
 *   variables: {
 *      patientId: // value for 'patientId'
 *      jwtToken: // value for 'jwtToken'
 *   },
 * });
 */
export function useRetrieveNotificationsSubscription(baseOptions: Apollo.SubscriptionHookOptions<RetrieveNotificationsSubscription, RetrieveNotificationsSubscriptionVariables> & ({ variables: RetrieveNotificationsSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RetrieveNotificationsSubscription, RetrieveNotificationsSubscriptionVariables>(RetrieveNotificationsDocument, options);
      }
export type RetrieveNotificationsSubscriptionHookResult = ReturnType<typeof useRetrieveNotificationsSubscription>;
export type RetrieveNotificationsSubscriptionResult = Apollo.SubscriptionResult<RetrieveNotificationsSubscription>;