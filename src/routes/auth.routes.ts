import * as express from 'express'
import {LoginPayload, LoginSrpAPayload, RegisterPayload} from "../../public/src/types";
import {AuthDatabase, SessionDatabase} from "../databases";
import {v4 as uuidv4} from 'uuid'
import {Session} from "inspector";
import {SRP, SrpServer} from "fast-srp-hap";
import * as jwt from 'jsonwebtoken'

const SRP_GROUP = 4096
const JWT_KEY = 'iF2hfg29FIW2'

const router = express.Router()

router.post<{}, {}, RegisterPayload>('/register', (req, res) => {
    try {
        AuthDatabase.create(req.body)
        res.send({message: 'ok'})
    } catch (e: any) {
        res.status(400).send({message: e.message})
    }
})

router.get('/login/:account', async (req, res) => {
    try {
        const payload = AuthDatabase.get(req.params.account)
        const srpSession = uuidv4()
        const {salt} = payload
        const secret2 = await SRP.genKey()
        const server = new SrpServer(SRP.params[SRP_GROUP], {
            username: payload.account,
            salt: Buffer.from(payload.salt, 'base64'),
            verifier: Buffer.from(payload.verifier, 'base64')
        }, secret2)
        SessionDatabase.create({srpSession, server, ...payload})
        res.send({message: 'ok', data: {salt, srpSession, srpGroup: SRP_GROUP}})
    } catch (e: any) {
        res.status(400).send({message: e.message})
    }
})

router.post<{}, {}, LoginSrpAPayload>('/login/SrpA', async (req, res) => {
    try {
        const {srpSession, srpA: srpABase64} = req.body
        const srpA = Buffer.from(srpABase64, 'base64')
        const sessionPayload = SessionDatabase.get(srpSession)
        const s = sessionPayload.server
        s.setA(srpA)
        const srpB = s.computeB()
        SessionDatabase.setServer(srpSession, s)
        res.send({data: {srpB: srpB.toString('base64')}})
    } catch (e: any) {
        res.status(400).send({message: e.message})
    }
})

router.post<{}, {}, LoginPayload>('/login', async (req, res) => {
    try {
        const {srpSession, m1: m1Base64} = req.body
        const M1 = Buffer.from(m1Base64, 'base64')
        const sessionPayload = SessionDatabase.get(srpSession)
        const s = sessionPayload.server
        s.checkM1(M1)
        const token = jwt.sign({account: sessionPayload.account}, JWT_KEY)
        res.send({data: {token}})
    } catch (e: any) {
        res.status(400).send({message: e.message})
    }
})

export const AuthRoutes = router