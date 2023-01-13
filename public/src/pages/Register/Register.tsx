import {Button, Container, Stack, TextField, Typography} from "@mui/material";
import {useCallback, useState} from "react";
import {RegisterPayload, RegisterStatePayload} from "../../types";
import {SRP} from 'fast-srp-hap';
import {AuthService} from "../../service";
import {useSnackbar} from "notistack";
import {SnackbarUtil} from "../../providers";

export function Register(): JSX.Element {
    const [payload, setPayload] = useState<RegisterStatePayload>({
        account: '',
        password: '',
        password2: ''
    })

    const [error, setError] = useState<Array<keyof RegisterStatePayload>>([])

    const validateError = useCallback((): boolean => {
        const missing: Array<keyof RegisterStatePayload> = Object.entries(payload).filter(([key, value]) => value.length === 0).map(([key, _]) => key) as any
        if (missing.length > 0) {
            setError(missing)
            return false
        }

        if (payload.password !== payload.password2) {
            setError(['password', 'password2'])
            return false
        }

        setError([])
        return true
    }, [payload])

    const register = useCallback(async () => {
        if (!validateError()) {
            return
        }

        const salt = await SRP.genKey(32);
        const verifier = SRP.computeVerifier(SRP.params[4096], salt, Buffer.from(payload.account), Buffer.from(payload.password))

        const registerPayload: RegisterPayload = {
            account: payload.account,
            salt: salt.toString('base64'),
            verifier: verifier.toString('base64')
        }
        await AuthService.register(registerPayload)

        SnackbarUtil.success('register success')
    }, [payload])

    return <Stack spacing={2}>
        <Typography variant='h5' align='center'>
            Register
        </Typography>
        <TextField
            size='small'
            label='account'
            error={error.includes('account')}
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
            error={error.includes('password')}
            onChange={(e) => {
                setPayload(payload => ({
                    ...payload,
                    password: e.target.value
                }))
            }}
        />
        <TextField
            size='small'
            label='confirm password'
            error={error.includes('password2')}
            onChange={(e) => {
                setPayload(payload => ({
                    ...payload,
                    password2: e.target.value
                }))
            }}
        />
        <Button
            variant='contained'
            onClick={register}
        >
            Login
        </Button>
    </Stack>
}