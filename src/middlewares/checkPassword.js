import bcrypt from "bcrypt"
//this mdw checks if the password is valid and then hash it
export const checkPassword = async (req, res, next) => {
   try {
      //this code controls if the password has: 1 number, 1 special character and must be at least 10s characters long for a maximum of 16
      let { password } = req.body
      //if there is no password in the req.body, we can skip this check
      if (!password) {
         return next()
      }
      const passwordRegex =
         /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,20}$/
      if (!passwordRegex.test(password)) {
         return res.status(400).json({
            error: "CheckPassword: 1 number, 1 special character and must be at least 10 characters long for a maximum of 16",
         })
      }
      // this code hash the password and save it in the req object
      req.hashedPassword = await bcrypt.hash(password, 12)
      next()
   } catch (err) {
      next(err)
   }
}
