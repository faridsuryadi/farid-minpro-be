const db = require("../models")
const blog = db.Blog
const categori = db.Kategori
const user = db.User
const likes = db.Likes
const {Op, Sequelize} = require('sequelize')


module.exports = {
    getAll: async(req,res)=>{
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit||10;
            const offset = (page - 1) * limit;
            const search = {}
            const sort = req.query.sort || 'DESC'
            const sortBy = req.query.sortBy || `createdAt`
            const {judul, Kategori} = req.query
            if(judul){
                search.judul = {
                    [Op.like]: `%${judul}%`,
                  };
            }
        
            if (Kategori) {
                // Assuming you have a model named 'categori'
                const category = await categori.findOne({
                  where: {
                    Kategori: {
                      [Op.like]: `%${Kategori}%`,
                    },
                  },
                });
                if (category) {
                  search.KategoriId = category.id;
                } else {
                  // If category is not found, return an empty result
                  return res.status(200).send({
                    totalpage: 0,
                    currentpage: page,
                    total_blog: 0,
                    result: [],
                    status: true,
                  });
                }
              }
            const total = await blog.count({where:search})

            
            const result = await blog.findAll({include:[{
                model:user,
                attributes:["username"]
            }, 
            categori],
            attributes:["id","judul","konten","link","keyword","negara","KategoriId","UserId","imgBlog",
            [Sequelize.literal(
                "(SELECT COUNT(*) FROM likes WHERE likes.BlogId = blog.id)"),"totalLike"
            ]]
            ,where:search,limit, offset:offset,order:[[sortBy,sort]]}) 
            res.status(200).send({
                totalpage: Math.ceil(total/limit),
                currentpage: page,
                total_blog: total,
                result, 
                status:true
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    createBlog : async (req,res) =>{
        try {
        const {judul, konten, link, keyword, negara,kategori} = req.body
            console.log(req.body);
         const imgBlog = req.file.filename
         const catlike = await categori.findOne({
            where: {
                Kategori: {
                    [Op.like]: kategori 
                }
            }
        })
        if (!catlike) {
            return res.status(400).send({ message: 'Kategori tidak ada' });
        }
         const keywordsarr = keyword.split(',').map(keyword => keyword.trim());

         
         const result = await blog.create(
         {
            judul, konten, link, keyword: JSON.stringify(keywordsarr), negara, imgBlog, KategoriId:catlike.id,UserId: req.user.id,
         })
         res.status(200).send(result)
        } catch (error) {
         console.log(error)
         res.status(400).send(error)
        }
     },

     likeBlog : async(req, res) => {
        try {
            const {BlogId} = req.body;
            const UserId = req.user.id

            const islike = await likes.findOne({
                where : {
                    UserId,
                    BlogId
                }
            })

            if (islike) throw{
                message : "sudah di like"
            }

            const result = await likes.create({
                UserId,
                BlogId,
                suka:true,
            })
            console.log(result);
            res.status(200).send({
                message: 'Artikel disukai',
                result
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },
    getLike: async(req,res)=>{
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit||10;
            const offset = (page - 1) * limit;
            
            const total = await likes.count()
            const UserId = req.user.id


            const result = await likes.findAll({include: [{
                model: blog
            }],attributes:["BlogId"],
            where:{
                UserId : UserId
            },limit, offset:offset}) 
            res.status(200).send({
                totalpage: Math.ceil(total/limit),
                currentpage: page,
                total_blog: total,
                result, 
                status:true
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    userBlog: async(req,res)=>{
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit||10;
            const offset = (page - 1) * limit;
            
            const UserId = req.user.id
            const total = await blog.count({where:{
                UserId:UserId
            }})


            const result = await blog.findAll({
            attributes:["judul","UserId","konten","imgBlog","keyword","negara","KategoriId"],
            where:{
                UserId : UserId
            },limit, offset:offset}) 
            res.status(200).send({
                totalpage: Math.ceil(total/limit),
                currentpage: page,
                total_blog: total,
                result, 
                status:true
            }
        )
        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
}