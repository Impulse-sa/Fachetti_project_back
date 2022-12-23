const convertDate = (createdAt)=>{
    //Parse date
    const date = new Date(createdAt).toLocaleDateString('en-GB').split('/')
    const ddmm = date.slice(0,2).join('/')
    const yy = date[2].slice(2,4).toString()
    const ddmmyy = ddmm + '/' + yy

    //Parse time
    const hours = new Date(createdAt).toLocaleTimeString('en-GB').split(':').slice(0,2).join(':')

    return `${ddmmyy} ${hours}`
}

module.exports={ convertDate }