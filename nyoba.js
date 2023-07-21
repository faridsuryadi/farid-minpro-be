createBlog: async (req, res) => {
    try {
      const { title, keyword, content, videoURL, country, category } = req.body;
      const imageURL = req.file.filename;   

      const catLike = await category.findOne({
        where: {
            category: {
                [Op.like]: category 
            }
        }
    })
    if (!catlike) {
      return res.status(400).send({ message: 'Kategori tidak ada' });
      const result = await blog.create({
        title,
        keyword,
        imageURL,
        content,
        videoURL,
        country,
        AccountId: req.user.id,
        CategoryId: catLike.id
      });
      
      res.status(200).send({
        msg: "Your blog has been created!",
        status: true,
        result
      });
    } }
    catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }