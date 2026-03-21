import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "concordian" | "security" | "admin";




export type DayKey =
    | "Mon"
    | "Tue"
    | "Wed"
    | "Thu"
    | "Fri"
    | "Sat"
    | "Sun";

export type DayPreference = {
    day: DayKey;
    enabled: boolean;
    allDay: boolean;
    startTime: string;
    endTime: string;
};

export type BuildingPreference = {
    buildingId: string;
    buildingName: string;
    subscribed: boolean;
    dayPreferences: DayPreference[];
};

export type StoredUser = {
    firstName: string;
    lastName: string;
    role: UserRole;
    idNumber: string;
    phone: string;
    email: string;
    password: string;
    buildingPreferences?: BuildingPreference[];
};

export type CurrentUser = Omit<StoredUser, "password"> & {
    isGuest: boolean;
};

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export async function getUsers(): Promise<StoredUser[]> {
    try {
        const raw = await AsyncStorage.getItem(USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Error reading users:", error);
        return [];
    }
}

export async function saveUsers(users: StoredUser[]): Promise<void> {
    try {
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Error saving users:", error);
    }
}

export async function addUser(
    user: StoredUser
): Promise<{ ok: boolean; message?: string }> {
    const users = await getUsers();

    const existingUser = users.find(
        (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (existingUser) {
        return { ok: false, message: "An account with that email already exists." };
    }

    users.push(user);
    await saveUsers(users);
    return { ok: true };
}

export async function findUserByCredentials(
    email: string,
    password: string
): Promise<StoredUser | null> {
    const users = await getUsers();

    const user = users.find(
        (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
    );

    return user || null;
}

export async function setCurrentUser(user: CurrentUser): Promise<void> {
    try {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Error saving current user:", error);
    }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("Error reading current user:", error);
        return null;
    }
}

export async function clearCurrentUser(): Promise<void> {
    try {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
        console.error("Error clearing current user:", error);
    }
}

export async function updateCurrentUser(
    updatedFields: Partial<CurrentUser>
): Promise<void> {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return;

        const updatedUser: CurrentUser = {
            ...currentUser,
            ...updatedFields,
        };

        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

        if (!updatedUser.isGuest) {
            const users = await getUsers();

            const oldEmail = currentUser.email.toLowerCase();

            const updatedUsers = users.map((user) =>
                user.email.toLowerCase() === oldEmail
                    ? {
                        ...user,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        role: updatedUser.role,
                        idNumber: updatedUser.idNumber,
                        phone: updatedUser.phone,
                        email: updatedUser.email,
                        buildingPreferences: updatedUser.buildingPreferences ?? [],
                    }
                    : user
            );

            await saveUsers(updatedUsers);
        }
    } catch (error) {
        console.error("Error updating current user:", error);
    }
}