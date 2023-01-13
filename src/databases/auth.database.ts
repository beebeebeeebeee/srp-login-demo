import {RegisterPayload} from "../../public/src/types";

const Database: Array<RegisterPayload> = []

function create(payload: RegisterPayload): void {
    if (Database.find(each => each.account === payload.account) !== undefined) {
        throw new Error('account exist')
    }
    Database.push(payload)
}

function get(account: string): RegisterPayload {
    const payload = Database.find(each => each.account === account)
    if (payload === undefined) {
        throw new Error('account not found')
    }
    return payload
}


export const AuthDatabase = {create, get}