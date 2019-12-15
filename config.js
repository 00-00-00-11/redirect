module.exports = {
    port: 3000,
    host:`http://localhost:3000`,
    //whenever an account registers with this username and it is not taken the user will be given perm level 100. not secure at all but neither is my code
    admins:["admin"],
    applicationMeta: {
        version:"1.1.0"
    },
    //perm conf
    perms: {
        //anyone with this perm lvl can do anything basically. dangerous
        administrator: 100,
    }
}