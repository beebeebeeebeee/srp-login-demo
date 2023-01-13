import {Button, Stack, TextField, Typography} from "@mui/material";
import {useCallback, useState} from "react";
import {LoginPayload, LoginSrpAPayload, LoginStatePayload, RegisterPayload, RegisterStatePayload} from "../../types";
import {SRP, SrpClient} from "fast-srp-hap";
import {AuthService} from "../../service";
import {SnackbarUtil} from "../../providers";

export function Login(): JSX.Element {
    const [payload, setPayload] = useState<LoginStatePayload>({
        account: '',
        password: ''
    })

    const [error, setError] = useState<Array<keyof LoginStatePayload>>([])

    const validateError = useCallback((): boolean => {
        const missing: Array<keyof LoginStatePayload> = Object.entries(payload).filter(([key, value]) => value.length === 0).map(([key, _]) => key) as any
        if (missing.length > 0) {
            setError(missing)
            return false
        }

        setError([])
        return true
    }, [payload])

    const login = useCallback(async () => {
        if (!validateError()) {
            return
        }

        // 1. get account's salt from server
        const {salt: saltBase64, srpSession, srpGroup} = await AuthService.loginGetSalt(payload.account)
        const salt = Buffer.from(saltBase64, 'base64')

        // 2. gen key and create SRP Client
        const secret1 = await SRP.genKey()
        const c = new SrpClient(SRP.params[srpGroup], salt, Buffer.from(payload.account), Buffer.from(payload.password), secret1)

        // 3. compute A
        const srpA = c.computeA()

        // 4. send A to Server and get B
        const loginSrpAPayload: LoginSrpAPayload = {
            srpSession,
            srpA: srpA.toString('base64')
        }
        const {srpB: srpBBase64} = await AuthService.loginSrpA(loginSrpAPayload)
        const srpB = Buffer.from(srpBBase64, 'base64')

        // 5. set B to SRP Client and get M1
        c.setB(srpB)
        const M1 = c.computeM1()

        // 6. send M1 to server and get token
        const loginPayload: LoginPayload = {
            m1: M1.toString('base64'),
            srpSession
        }
        const {token} = await AuthService.login(loginPayload)
        console.log(token)

        SnackbarUtil.success('login success')
    }, [payload])

    return <Stack spacing={2}>
        <Typography variant='h5' align='center'>
            Login
        </Typography>
        <TextField
            size='small'
            label='account'
            onChange={(e) => {
                setPayload(payload => ({
                    ...payload,
                    account: e.target.value
                }))
            }}
        />
        <TextField
            size='small'
            label='password'
            onChange={(e) => {
                setPayload(payload => ({
                    ...payload,
                    password: e.target.value
                }))
            }}
        />
        <Button
            variant='contained'
            onClick={login}
        >
            Login
        </Button>
    </Stack>
}