import axios from "axios";
import {
    LoginPayload,
    LoginResponse,
    LoginSaltResponse,
    LoginSrpAPayload,
    LoginSrpAResponse,
    RegisterPayload
} from "../types";
import {SnackbarUtil} from "../providers";

const instance = axios.create({
    baseURL: '/api/auth',
    timeout: 5000
})

instance.interceptors.response.use(
    (config) => config,
    (error) => {
        const message = error?.response?.data?.message ?? error.message
        SnackbarUtil.error(message)
        Promise.reject(message)
    }
)

async function loginGetSalt(account: string): Promise<LoginSaltResponse> {
    const result = await instance.get(`/login/${account}`)
    const data: LoginSaltResponse = result.data.data
    return data
}

async function loginSrpA(payload: LoginSrpAPayload): Promise<LoginSrpAResponse> {
    const result = await instance.post('/login/SrpA', payload)
    const data: LoginSrpAResponse = result.data.data
    return data
}

async function login(payload: LoginPayload): Promise<LoginResponse> {
    const result = await instance.post('/login', payload)
    const data: LoginResponse = result.data.data
    return data
}

async function register(payload: RegisterPayload): Promise<void> {
    const {data} = await instance.post('/register', payload)
    console.log(data)
}

export const AuthService = {loginGetSalt, loginSrpA, login, register}