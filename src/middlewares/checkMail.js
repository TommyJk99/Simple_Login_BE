export const checkMail = (req, res, next) => {
   const { email } = req.body
   //this regex controls if the email has: 1 @, 1 dot, 1 character before @, 1 character between @ and dot, 1 character after dot
   const mailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
   if (!mailRegex.test(email)) {
      return res.status(400).json({
         error: "CheckMailR: email is not valid",
      })
   }
   next()
}
