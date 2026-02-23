import { NavigatorScreenParams } from '@react-navigation/native';

// ─── Home Stack ───────────────────────────────────────────
export type HomeStackParamList = {
    HomeScreen: undefined;
    Backup: undefined;
};

// ─── Clients Stack ────────────────────────────────────────
export type ClientsStackParamList = {
    ClientsList: undefined;
    ClientDetail: { ownerId: number };
    AddEditClient: { ownerId?: number }; // undefined = create, defined = edit
    PetsList: { ownerId: number }; // List pets for a specific owner
    PetDetail: { petId: number; ownerId: number };
    AddEditPet: { ownerId: number; petId?: number };
};

// ─── Agenda Stack ─────────────────────────────────────────
export type AgendaStackParamList = {
    AgendaList: undefined;
    AddAppointment: { date?: string; petId?: number };
    AppointmentDetail: { appointmentId: number };
};

// ─── Finance Stack ────────────────────────────────────────
export type FinanceStackParamList = {
    FinanceScreen: undefined;
    PaymentDetail: { paymentId: number };
    AddEditPayment: { ownerId?: number; paymentId?: number };
};

// ─── Pets Stack ───────────────────────────────────────────
export type PetsStackParamList = {
    PetsList: { ownerId?: number }; // Optional: if provided, filters by owner
    PetDetail: { petId: number };
    AddEditPet: { ownerId?: number; petId?: number }; // ownerId required if creating new
};

// ─── Root Tab Navigator ──────────────────────────────────
export type RootTabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>;
    Clients: NavigatorScreenParams<ClientsStackParamList>;
    Pets: NavigatorScreenParams<PetsStackParamList>;
    Agenda: NavigatorScreenParams<AgendaStackParamList>;
    Finance: NavigatorScreenParams<FinanceStackParamList>;
};
