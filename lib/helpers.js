const conf = require("../config")

exports.message = (o = {e_line:"error",e_message:"error did happen",back:"about:blank"}) => {
   return `${conf.host}/message/?back=${o.back}&type=${o.e_line}&message=${o.e_message}`
}

