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
};

export type AppointmentInput = {
  doctorId: Scalars['Int']['input'];
  encounterMode: Scalars['String']['input'];
  startTime: Scalars['DateTime']['input'];
};

export type AppointmentType = {
  __typename?: 'AppointmentType';
  cost: Scalars['Decimal']['output'];
  doctor?: Maybe<BookmarkedDoctorType>;
  encounterMode: CoreAppointmentEncounterModeChoices;
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  patient: PatientType;
  paymentCompleted: Scalars['Boolean']['output'];
  rastucId: Scalars['String']['output'];
  startTime: Scalars['DateTime']['output'];
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
  clinicVisitPrice: Scalars['Decimal']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  homecarePrice: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
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

/** An enumeration. */
export enum CoreAppointmentEncounterModeChoices {
  /** Clinic Visit */
  Clinic = 'CLINIC',
  /** Homecare */
  Home = 'HOME',
  /** Teleconsult */
  Tele = 'TELE'
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

export type DoctorType = {
  __typename?: 'DoctorType';
  appointmentSet: Array<AppointmentType>;
  clinicVisitPrice: Scalars['Decimal']['output'];
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  homecarePrice: Scalars['Decimal']['output'];
  id: Scalars['ID']['output'];
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

export type Mutation = {
  __typename?: 'Mutation';
  bookAppointment?: Maybe<BookAppointment>;
  bookmarkDoctor?: Maybe<BookmarkDoctor>;
  createPatientProfile?: Maybe<CreatePatientProfile>;
  editProfile?: Maybe<EditProfile>;
  refreshToken?: Maybe<Refresh>;
  signIn?: Maybe<SignIn>;
  signUp?: Maybe<SignUp>;
  /** Obtain JSON Web Token mutation */
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  unbookmarkDoctor?: Maybe<UnbookmarkDoctor>;
  verifyToken?: Maybe<Verify>;
};


export type MutationBookAppointmentArgs = {
  bookingArgs: AppointmentInput;
};


export type MutationBookmarkDoctorArgs = {
  doctorId: Scalars['Int']['input'];
};


export type MutationCreatePatientProfileArgs = {
  input: CreatePatientProfileInput;
};


export type MutationEditProfileArgs = {
  input: EditProfileInput;
};


export type MutationRefreshTokenArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
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
  appointmentSet: Array<AppointmentType>;
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
  appointments?: Maybe<Array<Maybe<AppointmentType>>>;
  bookmarkedDoctors?: Maybe<Array<Maybe<BookmarkedDoctorType>>>;
  counties?: Maybe<Array<Maybe<CountyType>>>;
  countries?: Maybe<Array<Maybe<CountryType>>>;
  doctors?: Maybe<Array<Maybe<DoctorType>>>;
  hello?: Maybe<Scalars['String']['output']>;
  me?: Maybe<UserType>;
  patients?: Maybe<Array<Maybe<PatientType>>>;
  specialties?: Maybe<Array<Maybe<SpecialtyType>>>;
};


export type QueryCountiesArgs = {
  countryId?: InputMaybe<Scalars['Int']['input']>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar']['output'];
  refreshExpiresIn: Scalars['Int']['output'];
  token: Scalars['String']['output'];
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
  patientId: Scalars['Int']['input'];
};

export type UnbookmarkDoctor = {
  __typename?: 'UnbookmarkDoctor';
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

export type CreatePatientProfileMutationVariables = Exact<{
  input: CreatePatientProfileInput;
}>;


export type CreatePatientProfileMutation = { __typename?: 'Mutation', createPatientProfile?: { __typename?: 'CreatePatientProfile', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string } | null, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

export type EditProfileMutationVariables = Exact<{
  input: EditProfileInput;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile?: { __typename?: 'EditProfile', success?: boolean | null, error?: string | null, user?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string } | null, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

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

export type VerifyTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyTokenMutation = { __typename?: 'Mutation', verifyToken?: { __typename?: 'Verify', payload: any } | null };

export type GetBookmarkedDoctorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookmarkedDoctorsQuery = { __typename?: 'Query', bookmarkedDoctors?: Array<{ __typename?: 'BookmarkedDoctorType', id: string, title: string, firstName: string, lastName: string, fullName: string, profilePictureUrl?: string | null, teleconsultPrice: any, clinicVisitPrice: any, homecarePrice: any, primarySpecialty?: { __typename?: 'SpecialtyType', id: string, name: string } | null } | null> | null };

export type GetDoctorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDoctorsQuery = { __typename?: 'Query', doctors?: Array<{ __typename?: 'DoctorType', id: string, title: string, firstName: string, lastName: string, fullName: string, profilePictureUrl?: string | null, teleconsultPrice: any, clinicVisitPrice: any, homecarePrice: any, takesPrepaidPayment: boolean, takesPostpaidPayment: boolean, primarySpecialty?: { __typename?: 'SpecialtyType', id: string, name: string } | null, subSpecialties: Array<{ __typename?: 'SpecialtyType', id: string, name: string }> } | null> | null };

export type GetMyAppointmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyAppointmentsQuery = { __typename?: 'Query', appointments?: Array<{ __typename?: 'AppointmentType', id: string, startTime: any, endTime: any, encounterMode: CoreAppointmentEncounterModeChoices, cost: any, paymentCompleted: boolean, rastucId: string, doctor?: { __typename?: 'BookmarkedDoctorType', id: string, fullName: string, title: string, primarySpecialty?: { __typename?: 'SpecialtyType', name: string } | null } | null } | null> | null };

export type ProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ProfileQuery = { __typename?: 'Query', me?: { __typename?: 'UserType', id: string, email?: string | null, phoneNumber?: string | null, firstName: string, lastName: string, patient?: { __typename?: 'PatientType', id: string, firstName: string, lastName: string, middleName: string, dateOfBirth?: any | null, gender: string, email?: string | null, phoneNumber?: string | null, profilePictureUrl?: string | null, country?: { __typename?: 'CountryType', id: string, name: string } | null, county?: { __typename?: 'CountyType', id: string, name: string } | null } | null } | null };

export type GetSpecialtiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSpecialtiesQuery = { __typename?: 'Query', specialties?: Array<{ __typename?: 'SpecialtyType', id: string, name: string } | null> | null };

export type OnNewNotificationSubscriptionVariables = Exact<{
  patientId: Scalars['Int']['input'];
}>;


export type OnNewNotificationSubscription = { __typename?: 'Subscription', retrieveNewNotifications?: { __typename?: 'NotificationType', id: number, title: string, description: string, createdAt: any, isRead: boolean } | null };


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
export const GetMyAppointmentsDocument = gql`
    query GetMyAppointments {
  appointments {
    id
    startTime
    endTime
    encounterMode
    cost
    paymentCompleted
    rastucId
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
export const OnNewNotificationDocument = gql`
    subscription OnNewNotification($patientId: Int!) {
  retrieveNewNotifications(patientId: $patientId) {
    id
    title
    description
    createdAt
    isRead
  }
}
    `;

/**
 * __useOnNewNotificationSubscription__
 *
 * To run a query within a React component, call `useOnNewNotificationSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnNewNotificationSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnNewNotificationSubscription({
 *   variables: {
 *      patientId: // value for 'patientId'
 *   },
 * });
 */
export function useOnNewNotificationSubscription(baseOptions: Apollo.SubscriptionHookOptions<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables> & ({ variables: OnNewNotificationSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnNewNotificationSubscription, OnNewNotificationSubscriptionVariables>(OnNewNotificationDocument, options);
      }
export type OnNewNotificationSubscriptionHookResult = ReturnType<typeof useOnNewNotificationSubscription>;
export type OnNewNotificationSubscriptionResult = Apollo.SubscriptionResult<OnNewNotificationSubscription>;