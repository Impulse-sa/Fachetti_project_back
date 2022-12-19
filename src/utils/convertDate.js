const convertDate = (createdAt)=>{
    const date = new Date(createdAt).toLocaleDateString('us')
    const hours = new Date(createdAt).toLocaleTimeString('us')
    return `${date} ${hours}`
}

module.exports={ convertDate }