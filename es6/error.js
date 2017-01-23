export default function(httpStatus, message){
  const error = new Error(message)
  error.statusCode = httpStatus
  return error
}
