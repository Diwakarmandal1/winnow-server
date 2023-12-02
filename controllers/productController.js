import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import createProductModels from "../models/CreateProductSchema.js";
// import Products from "../models/productModel.js";

dotenv.config();

export const createProductController = async (req, res) => {
  // console.log("formdata:",req.body.getAll("name"))
  console.log(req.body)
  try {
    const { name, funded, backers, totalFund, category, fundRaised, photo } =
      req.body;

    const products = new productModel({ ...req.body });

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    // res.status(500).send({
    //   success: false,
    //   error,
    //   message: "Error in crearing product",
    // });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await createProductModels
      .find({})
      // .populate("categories")
      // .limit(3)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await createProductModels
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("categories");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
// export const deleteProductController = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.params.pid).select("-photo");
//     res.status(200).send({
//       success: true,
//       message: "Product Deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while deleting product",
//       error,
//     });
//   }
// };

export const deleteProductController = async (req, res) => {
  const  id  = req.params.pid;
try {
  const data = await createProductModels.findByIdAndDelete({ _id: id });
  res.status(200).send({
    success: true,
    massage: "product  Deleted Successfully",
    data,
  });
} catch (error) {
  res.send(500).send({
    success: false,
    massage: "Error while Delete the product ",
  });
}
};

// //upate producta
// export const updateProductController = async (req, res) => {
//   try {
//     const { name, description, price, category, quantity, shipping } =
//       req.fields;
//     const { photo } = req.files;
//     //alidation
//     switch (true) {
//       case !name:
//         return res.status(500).send({ error: "Name is Required" });
//       case !description:
//         return res.status(500).send({ error: "Description is Required" });
//       case !price:
//         return res.status(500).send({ error: "Price is Required" });
//       case !category:
//         return res.status(500).send({ error: "Category is Required" });
//       case !quantity:
//         return res.status(500).send({ error: "Quantity is Required" });
//       case photo && photo.size > 1000000:
//         return res
//           .status(500)
//           .send({ error: "photo is Required and should be less then 1mb" });
//     }

//     const products = await productModel.findByIdAndUpdate(
//       req.params.pid,
//       { ...req.fields, slug: slugify(name) },
//       { new: true }
//     );
//     if (photo) {
//       products.photo.data = fs.readFileSync(photo.path);
//       products.photo.contentType = photo.type;
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Updated Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Updte product",
//     });
//   }
// };
// Controller to handle product update
export const updateProductController = async (req, res) => {
  try {
    const { fname, funded, totalFund, fundRaised, categories, assetvalue, minInvestment, rentalYield, targetIRR, targetMultiple, locationName, locationDesc, overview, tenancy } = req.body;

    // Validation
    switch (true) {
      case !fname:
        return res.status(500).json({ error: "Product Title is required" });
      case !funded:
        return res.status(500).json({ error: "Backers Fund is required" });
      case !totalFund:
        return res.status(500).json({ error: "Total Fund Required is required" });
      case !fundRaised:
        return res.status(500).json({ error: "Fund Raised is required" });
      case !categories || categories.length === 0:
        return res.status(500).json({ error: "At least one category is required" });
      case !assetvalue:
        return res.status(500).json({ error: "Assets Value is required" });
      case !minInvestment:
        return res.status(500).json({ error: "Minimum Investment is required" });
      case !rentalYield:
        return res.status(500).json({ error: "Rental Yield is required" });
      case !targetIRR:
        return res.status(500).json({ error: "Target IRR is required" });
      case !targetMultiple:
        return res.status(500).json({ error: "Target Multiple is required" });
      case !locationName:
        return res.status(500).json({ error: "Location Name is required" });
      case !locationDesc:
        return res.status(500).json({ error: "Location Description is required" });
      case !overview:
        return res.status(500).json({ error: "Overview is required" });
      case !tenancy:
        return res.status(500).json({ error: "Tenancy Description is required" });
    }

    const updatedProduct = await createProductModels.findByIdAndUpdate(
      req.params.pid, // Assuming you have the product ID in the request parameters
      {
        fname,
        funded,
        totalFund,
        fundRaised,
        categories,
        assetvalue,
        minInvestment,
        rentalYield,
        targetIRR,
        targetMultiple,
        locationName,
        locationDesc,
        overview,
        tenancy,
      },
      { new: true }
    );

    // If you are handling file uploads (e.g., updating product photo), you can do that here.
    // You may need to update the productModel schema to include a field for photo and handle file uploads using multer or other middleware.

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};
// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};