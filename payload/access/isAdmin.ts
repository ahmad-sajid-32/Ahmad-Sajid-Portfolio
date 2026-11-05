import type { Access } from 'payload'

/** True when a Payload user is signed in. Ahmad is the only user. */
export const isAdmin: Access = ({ req: { user } }) => Boolean(user)
