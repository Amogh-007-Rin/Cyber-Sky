import zod from "zod";

export const UserSchema = zod.object({
    fullName: zod.string().min(2),
    email: zod.string().email(),
    password: zod.string().min(6),
});
