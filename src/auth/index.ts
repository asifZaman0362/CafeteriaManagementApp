import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

export async function checkPassword(username: string, password: string) : bool {
    try {
        let stored_hash: string = await database.getPasswordHash(username);
        return await argon2.verify(stored_hash, password);
    } catch (error: DatabaseError) {
        console.error(error);
    }
}
