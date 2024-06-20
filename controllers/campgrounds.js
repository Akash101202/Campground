const Campground = require('../models/campground')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken})
const { cloudinary } = require("../cloudinary");

const Razorpay = require("razorpay");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});


module.exports.search = async (req, res) => {
    const searchQuery = req.query.q;
    let campgrounds;
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    
    if (searchQuery) {
        const regex = new RegExp(escapeRegex(searchQuery), 'gi');
        campgrounds = await Campground.find({ 
            $or: [{ title: regex }, { location: regex }] 
        });
    } else {
        campgrounds = await Campground.find({});
    }
    res.render('campgrounds/search', { campgrounds, searchQuery });
};



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}



module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit : 1
    }).send();
   
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

// module.exports.renderProductPage = async (req, res) => {
//     try {
//       res.render("campgrounds/bookcamp");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
  
module.exports.createOrder = async (req, res) => {
  try {
      const amount = req.body.amount * 100;
      const options = {
          amount: amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`
      };

      razorpayInstance.orders.create(options, (err, order) => {
          if (!err) {
              res.status(200).send({
                  success: true,
                  msg: "Order Created",
                  order_id: order.id,
                  amount: amount,
                  key_id: process.env.RAZORPAY_ID_KEY,
              });
          } else {
              res.status(400).send({ success: false, msg: "Something went wrong!" });
          }
      });
  } catch (error) {
      console.log(error.message);
      res.status(500).send({ success: false, msg: "Server Error" });
  }
};



module.exports.bookCampground = async (req, res) => {
        try {
            const campground = await Campground.findById(req.params.id);
            if (!campground) {
                req.flash('error', 'Cannot find that campground!');
                return res.redirect('/campgrounds');
            }
            res.render(`campgrounds/bookCamp`, { campground });
        } catch (err) {
            console.error(err);
            req.flash('error', 'Something went wrong!');
            res.redirect('/campgrounds');
        }

       
    };
    


module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}