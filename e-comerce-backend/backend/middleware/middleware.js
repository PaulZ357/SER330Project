const User = require('../models/User')
const {verifyToken} = require('../utils/utility.function')

const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : 'Invalid input !!')
}

const verifyUser = async (req, res, next) => {
  const {authorization} = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized ', res)
    return
  }
  try {
    const payload = await verifyToken(authorization.split(' ')[1])
    console.log(payload)
    if (!payload) {
      sendResponseError(400, `You are not authorized `, res)
    }
    const user = await User.findById(payload.id, {password: 0})
    req['user'] = user

    next()
  } catch (err) {
    console.log('Error ', err)
    sendResponseError(400, `Error ${err}`, res)
  }
}

module.exports = {
  sendResponseError,
  verifyUser,
}
