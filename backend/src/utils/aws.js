"use strict";
const dotenv = require("dotenv");
const aws = require("aws-sdk");
dotenv.config();

aws.config.update({
  accessKeyId: process.env.ACCESS_KEYS,
  secretAccessKey: process.env.SECRET_KEYS,
  region: "ap-south-1",
});
//aa
exports.uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    // this function will upload file to aws and return the link
    let s3 = new aws.S3({ apiVersion: "2006-03-01" }); // we will be using the s3 service of aws

    var uploadParams = {
      ACL: "public-read",
      Bucket: "nottodeletethis", //HERE
      Key: "ecom/" + Date.now().toString() + file.originalname, //HERE
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      // console.log(data)
      // console.log("file uploaded succesfully")
      return resolve(data.Location);
    });
  });
};
