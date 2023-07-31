var admin = require("firebase-admin");

var serviceAccount = require("./middleware/blog-application-393304-firebase-adminsdk-a8fm8-c5500e9d6c.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
admin.auth().signInWithPhoneNumber(+917037772781).then((verificationId)=>{
    console.log("otp sent to the user successfully",+verificationId);
  }).catch(err=>{
    console.log(err.message)
    });