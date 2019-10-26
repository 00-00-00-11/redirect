const conf = require("../config")

exports.message = (o = {e_line:"error",e_message:"error did happen",back:"about:blank"}) => {
   return `${conf.host}/message/?back=${o.back}&type=${o.e_line}&message=${o.e_message}`
}

exports.colours = {
   reset: '\x1b[0m',
   underscore: '\x1b[4m',
   fg: {
      black:'\x1b[30m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
   },
   bg: {
      black: '\x1b[40m',
      red: '\x1b[41m',
      green: '\x1b[42m',
      yellow: '\x1b[43m',
      blue: '\x1b[44m',
      magenta: '\x1b[45m',
      cyan: '\x1b[46m',
      white: '\x1b[47m'
   }
}

exports.logTypes = {
   log: `${exports.colours.fg.blue}LOG${exports.colours.reset}`,
   ok: `${exports.colours.fg.green}OK${exports.colours.reset}`,
   error: `${exports.colours.fg.red}ERROR${exports.colours.reset}`,
   warn: `${exports.colours.fg.yellow}WARN${exports.colours.reset}`
}

exports.log = (m="no message passed",lType) => {
   lType = lType ? lType : exports.logTypes.log
   console.log(`[${lType}] ${m}`)

}

