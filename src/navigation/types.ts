import { NavigatorScreenParams } from '@react-navigation/native';

// ─── Home Stack ───────────────────────────────────────────
export type HomeStackParamList = {
    HomeScreen: undefined;
};

// ─── Clients Stack ────────────────────────────────────────
export type ClientsStackParamList = {
    ClientsList: undefined;
    ClientDetail: { ownerId: number };
    AddEditClient: { ownerId?: number }; // undefined = create, defined = edit
    PetDetail: { petId: number; ownerId: number };
    AddEditPet: { ownerId: number; petId?: number };
};

// ─── Agenda Stack ─────────────────────────────────────────
export type AgendaStackParamList = {
    AgendaScreen: undefined;
    AddEditAppointment: { appointmentId?: number; petId?: number };
};

// ─── Finance Stack ────────────────────────────────────────
export type FinanceStackParamList = {
    FinanceScreen: undefined;
    PaymentDetail: { paymentId: number };
    AddEditPayment: { ownerId?: number; paymentId?: number };
};

// ─── Root Tab Navigator ──────────────────────────────────
export type RootTabParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>;
    Clients: NavigatorScreenParams<ClientsStackParamList>;
    Agenda: NavigatorScreenParams<AgendaStackParamList>;
    Finance: NavigatorScreenParams<FinanceStackParamList>;
};
