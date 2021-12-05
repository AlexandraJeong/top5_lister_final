const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String },
        likesList: {type: [String]},
        dislikesList: {type: [String]},
        views: {type: Number},
        isPublished: {type: Boolean},
        publishDate: {type: Date},
        publishDateString: {type: String},
        comments: {type: [Object]},
        isCommunity: {type: Boolean},
        communityItems: {type: [Object]}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
