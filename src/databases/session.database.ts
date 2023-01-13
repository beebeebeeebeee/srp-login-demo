import {RegisterPayload} from "../../public/src/types";
import {SrpServer} from "fast-srp-hap";

type DatabasePayload = RegisterPayload & {
    srpSession: string
    server: SrpServer
}

const Database: Array<DatabasePayload> = []

function create(payload: DatabasePayload): void {
    if (Database.find(each => each.srpSession === payload.srpSession) !== undefined) {
        throw new Error('session exist')
    }
    Database.push(payload)
}

function get(srpSession: string): DatabasePayload {
    const payload = Database.find(each => each.srpSession === srpSession)
    if (payload === undefined) {
        throw new Error('session not found')
    }
    return payload
}

function setServer(srpSession: string, server: SrpServer) {
    const payload = Database.find(each => each.srpSession === srpSession)
    if (payload === undefined) {
        throw new Error('session not found')
    }
    payload.server = server
}

function getServer(srpSession: string): SrpServer {
    const payload = Database.find(each => each.srpSession === srpSession)
    if (payload === undefined) {
        throw new Error('session not found')
    }
    if (payload.server === undefined) {
        throw new Error('session server not found')
    }
    return payload.server
}

function remove(srpSession: string): void {
    const index = Database.findIndex(each => each.srpSession === srpSession)
    Database.splice(index, 1)
}

export const SessionDatabase = {create, get, setServer, getServer, remove}