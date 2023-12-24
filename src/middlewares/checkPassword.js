import bcrypt from "bcrypt"
//this mdw checks if the password is valid and then hash it
export const checkPassword = async (req, res, next) => {
   try {
      //this code controls if the password has: 1 number, 1 special character and must be at least 7 characters long for a maximum of 16
      let { password } = req.body
      const passwordRegex =
         /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/
      if (!passwordRegex.test(password)) {
         return res.status(400).json({
            error: "CheckPassword: 1 number, 1 special character and must be at least 6 characters long for a maximum of 16",
         })
      }
      // this code hash the password and save it in the req object
      req.hashedPassword = await bcrypt.hash(password, 12)
      next()
   } catch (err) {
      next(err)
   }
}
