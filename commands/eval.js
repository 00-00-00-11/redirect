exports.run = (args) => {
    let rv = eval(args.join(""))
    return {
        type:"evalued",
        line:rv
    }
}

exports.meta = {
    requiredLevel: 100
}