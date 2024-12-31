class expressError extends Error{
    constructor(error,status){
        super();
        this.status=status
        this.message=error;
    }
}

module.exports={expressError};