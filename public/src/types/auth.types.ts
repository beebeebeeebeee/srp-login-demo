export type LoginStatePayload = {
    account: string;
    password: string;
}

export type LoginSaltResponse = {
    salt: string;
    srpSession: string;
    srpGroup: 1024 | 2048 | 4096;
}

export type LoginSrpAPayload = {
    srpSession: string;
    srpA: string;
}

export type LoginSrpAResponse = {
    srpB: string;
}

export type LoginPayload = {
    srpSession: string;
    m1: string;
}

export type LoginResponse = {
    token: string;
}

export type RegisterStatePayload = {
    password2: string;
} & LoginStatePayload

export type RegisterPayload = {
    account: string;
    salt: string;
    verifier: string;
}