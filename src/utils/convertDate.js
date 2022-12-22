const convertDate = (createdAt)=>{
    const date = new Date(createdAt).toLocaleDateString('en')
    const hours = new Date(createdAt).toLocaleTimeString('en')
    return `${date} ${hours}`
}

module.exports={ convertDate }