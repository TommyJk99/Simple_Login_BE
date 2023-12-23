export const checkPassword = (req, res, next) => {
   const { password } = req.body
   //this regex controls if the password has: 1 number, 1 special character and must be at least 7 characters long for a maximum of 16
   const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,20}$/
   if (!passwordRegex.test(password)) {
      return res.status(400).json({
         error: "CheckPassword: 1 number, 1 special character and must be at least 6 characters long for a maximum of 16",
      })
   }
   next()
}
