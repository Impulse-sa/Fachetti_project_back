const convertDate = (createdAt)=>{
    const date = new Date(createdAt).toLocaleDateString('en-GB')
    const hours = new Date(createdAt).toLocaleTimeString('en-GB')
    return `${date} ${hours}`
}

module.exports={ convertDate }