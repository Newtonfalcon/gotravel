import crypto from "crypto"

export function generateTxRef(userId){
    return `GT-${userId}-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;
}