import bcrypt from "bcryptjs";
import endpoint from "./endpoint";

interface hashResponseObject {
    _id: string
    type: 'admin'
    hash: string
}

async function comparePassword(password: string): Promise<boolean> {
    const response = await fetch(`${endpoint}/password/`);
    const data = await response.json() as hashResponseObject;

    return bcrypt.compareSync(password, data.hash);
};

export default comparePassword;
