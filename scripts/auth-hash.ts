/**
 * Cetak bcrypt hash untuk sebuah password.
 *   npm run auth:hash -- 'passwordku'
 */
import bcrypt from "bcryptjs"

const pw = process.argv[2]
if (!pw) {
  console.error("Pakai: npm run auth:hash -- 'password'")
  process.exit(1)
}

console.log(await bcrypt.hash(pw, 12))
