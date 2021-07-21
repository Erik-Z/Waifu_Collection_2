const Filters = {
    ALL: "All",
    LIKED: "Liked",
    FOLLOWED: "Followed",
    MY_WAIFUS: "MyWaifus"
}

const DevStates = {
    local: "http://192.168.1.199:3000/",
    production: "https://waifu-collection-server.herokuapp.com/",
}

const DevState = DevStates.local

export {Filters, DevState, DevStates}