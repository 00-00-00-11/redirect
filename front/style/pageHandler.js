
const parseUrl = (url) => {
    const partialUrl = url.split("#/")[1]
    if(!partialUrl) return
    const args = partialUrl.split("/")
    return {
        page: args[0],
        params: args.slice(1)
    }
}

let old;

const render = () => {
    let args = parseUrl(window.location.href)
    if(old) $(old).hide();
    old = $(`#${args.page}`)
    $(old).show()
}
window.addEventListener("DOMContentLoaded",render,false)
window.addEventListener("hashchange", render, false);
