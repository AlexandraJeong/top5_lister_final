const Top5List = require('../models/top5list-model');
const User = require('../models/user-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }
    const top5List = new Top5List(body);
    console.log("creating top5List1: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({
            errorMessage: 'Improperly formatted request',
        })
    }

    // REMEMBER THAT OUR AUTH MIDDLEWARE GAVE THE userId TO THE req
    console.log("top5List created for " + req.userId);
    User.findOne({ _id: req.userId }, (err, user) => {
        console.log("user found: " + JSON.stringify(user));
        user.top5Lists.push(top5List._id);
        user
            .save()
            .then(() => {
                top5List
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            top5List: top5List
                        })
                    })
                    .catch(error => {
                        return res.status(400).json({
                            errorMessage: 'Top 5 List Not Created!'
                        })
                    })
            });
    })
}

deleteCommunityTop5List = async (req, res) => {
    console.log("deleteTop5List: " + req.params.id);
    await Top5List.findOneAndDelete({ _id: req.params.id }, () => {
        return res.status(200).json({ success: true});
    }).catch(err =>  {
        console.log("error caught: " + err);
        return res.status(400).json({ success: false })
    })
}

deleteTop5List = async (req, res) => {
    console.log("delete Top 5 List with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Top 5 List not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ email: list.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Top5List.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({});
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(top5List);
    })
}
getTop5ListById = async (req, res) => {
    await Top5List.findOne({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}
getTop5ListPairs = async (req, res) => {
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindList(email) {
            console.log("find all Top5Lists owned by " + email);
            await Top5List.find({ ownerEmail: email }, (err, top5Lists) => {
                console.log("found Top5Lists: " + JSON.stringify(top5Lists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!top5Lists) {
                    console.log("!top5Lists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Top 5 Lists not found' })
                }
                else {
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in top5Lists) {
                        let list = top5Lists[key];
                        let pair = {
                            _id: list._id,
                            name: list.name,
                            items: list.items,
                            ownerEmail: list.ownerEmail,
                            likesList: list.likesList,
                            dislikesList: list.dislikesList,
                            views: list.views,
                            isPublished: list.isPublished,
                            comments: list.comments,
                            isCommunity: list.isCommunity,
                            publishDate: list.publishDate,
                            publishDateString: list.publishDateString,
                            communityItems: list.communityItems
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindList(user.email);
    }).catch(err => console.log(err))
}
getPublishedTop5ListPairs = async (req, res) => {
    await Top5List.find({isPublished: true, isCommunity: false}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                            ownerEmail: list.ownerEmail,
                            likesList: list.likesList,
                            dislikesList: list.dislikesList,
                            views: list.views,
                            isPublished: list.isPublished,
                            comments: list.comments,
                            isCommunity: list.isCommunity,
                            communityItems: list.communityItems,
                            publishDate: list.publishDate,
                            publishDateString: list.publishDateString
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err))
}

getCommunityTop5ListPairs = async (req, res) => {
    await Top5List.find({isCommunity: true}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    items: list.items,
                            ownerEmail: list.ownerEmail,
                            likesList: list.likesList,
                            dislikesList: list.dislikesList,
                            views: list.views,
                            isPublished: list.isPublished,
                            comments: list.comments,
                            isCommunity: list.isCommunity,
                            publishDate: list.publishDate,
                            publishDateString: list.publishDateString,
                            communityItems: list.communityItems
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}

updateTop5ListNoPerms = async(req,res)=>{
        const body = req.body;
        console.log("updateTop5List: " + JSON.stringify(body));
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }
    
        Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Top 5 List not found!',
                })
            }
            top5List.likesList = body.top5List.likesList;
            top5List.dislikesList = body.top5List.dislikesList;
            top5List.views = body.top5List.views;
            top5List.comments = body.top5List.comments;
            top5List
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: 'Top 5 List updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Top 5 List not updated!',
                    })
                })
        })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ email: list.ownerEmail }, (err, user) => {
                if (list.ownerEmail ==null || user._id == req.userId) {
                    console.log("correct user!");
                    console.log("req.body.name, req.body.items: " + req.body.name + ", " + req.body.items);
                    list.name = body.top5List.name;
                    list.items = body.top5List.items;
                    list.likesList = body.top5List.likesList;
                    list.dislikesList = body.top5List.dislikesList;
                    list.views = body.top5List.views;
                    list.isPublished = body.top5List.isPublished;
                    list.comments = body.top5List.comments;
                    list.publishDate = body.top5List.publishDate;
                    list.publishDateString = body.top5List.publishDateString;
                    list.communityItems=body.top5List.communityItems;
                    list.isCommunity=body.top5List.isCommunity;
                    list
                        .save()
                        .then(() => {
                            console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Top 5 List updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error));
                            return res.status(404).json({
                                error,
                                message: 'Top 5 List not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(top5List);
    })
}

module.exports = {
    createTop5List,
    deleteTop5List,
    deleteCommunityTop5List,
    getTop5ListById,
    getTop5ListPairs,
    getTop5Lists,
    updateTop5List,
    updateTop5ListNoPerms,
    getPublishedTop5ListPairs,
    getCommunityTop5ListPairs
}