const paginate = ( page, pageSize ) => {
    const offset = page * pageSize;
    const limit = pageSize;
  
    return {
      limit,
      offset,
    };
  };

  module.exports={paginate}