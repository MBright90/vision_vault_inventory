import bcrypt from "bcryptjs";
import endpoint from "./endpoint";

async function comparePassword(password: string): Promise<boolean> {
    const response = await fetch(`${endpoint}/password/`);
    const data = await response.json() as string;

    return bcrypt.compareSync(password, data);
};

export default comparePassword;
