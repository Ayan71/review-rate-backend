// controllers/companyController.js

const Company = require("../model/company");

exports.createCompany = async (req, res) => {

  try {
    const {
      companyName,
      address,
      city,
      foundedDate,
      description,
    } = req.body;


    // validation
    if (!companyName || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Company name, address and city are required",
      });
    }
     let image = "";

    if (req.file) {
      image = req.file.path; 
    }
  

    // create company
    const company = await Company.create({
      companyName,
      address,
      city,
      foundedDate,
      description,
      image,
      createdBy: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: companies.length,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};