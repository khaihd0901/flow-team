export const authMe = async(req,res) =>{
    try{
        const user = req.user;
        return res.status(200).json({user: user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal Server Error !!!"})
    }
}
