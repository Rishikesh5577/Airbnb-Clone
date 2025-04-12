const joi = require("joi");

// listing joi schema 
module.exports.listingSchema = joi.object({
    listing:joi.object({
        title:joi.string(),
        description:joi.string(),
        location:joi.string(),
        country:joi.string(),
        price:joi.number().min(0),
        image:joi.string().allow("",null),

    }).required(),
})

// review joi schema
module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
})

// credentials joi
// module.exports.credentialSchema = joi.object(
//     {
//         info : joi.object({
//             username:joi.string().required(),
//             password:joi.string().required(),
//         }).required()
//     }
// )

// credentials register joi
module.exports.registerSchema = joi.object(
    {
        info : joi.object({
            username:joi.string().required(),
            password:joi.string().required(),
            dob:joi.date().required()
        }).required()
    }
)