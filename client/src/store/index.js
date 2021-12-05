import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    CHANGE_FILTER_MODE: "CHANGE_FILTER_MODE",
    CHANGE_FILTER_TEXT: "CHANGE_FILTER_TEXT",
    SET_SORT_MODE: "SET_SORT_MODE"
}


// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        filterMode: "your_lists",
        filterText: "",
        sort: "newest",
    });
    const history = useHistory();
    console.log("filtermode "+store.filterMode);//scrap

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: "your_lists",
                    filterText: store.filterText,
                    sort: store.sort
                })
            }
            case GlobalStoreActionType.SET_SORT_MODE: {
                console.log("setting sort method to " + payload.sort);
                return setStore({
                    idNamePairs: payload.pairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    sort: payload.sort,
                    filterText: store.filterText,
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                switch (store.sort) {
                    case "newest": {
                        payload.sort(newestPublishComparator);
                        break;
                    }
                    case "oldest": {
                        payload.sort(oldestPublishComparator);
                        break;
                    }
                    case "views": {
                        payload.sort(viewsComparator);
                        break;
                    }
                    case "likes": {
                        payload.sort(likesComparator);
                        break;
                    }
                    case "dislikes": {
                        payload.sort(dislikesComparator);
                        break;
                    }
                }
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: store.filterText,
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.CHANGE_FILTER_MODE: {
                return setStore({
                    idNamePairs: payload.pairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: payload.filterMode,
                    filterText: "",
                    sort: store.sort
                });
            }
            case GlobalStoreActionType.CHANGE_FILTER_TEXT: {
                return setStore({
                    idNamePairs: payload.pairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    filterMode: store.filterMode,
                    filterText: payload.text,
                    sort: store.sort
                });
            }
            default:
                return store;
        }
    }

    store.incrementViews = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            top5List.views += 1;
            updateList(top5List);
        }
    }

    function newestPublishComparator(listA, listB) {
        if (!listA.publishDate) {
            return 1;
        }
        if (!listB.publishDate) {
            return -1;
        }
        let a = new Date(listA.publishDate);
        let b = new Date(listB.publishDate);
        return b.getTime() - a.getTime();
    }

    function oldestPublishComparator(listA, listB) {
        if (!listA.publishDate) {
            return 1;
        }
        if (!listB.publishDate) {
            return -1;
        }
        let a = new Date(listA.publishDate);
        let b = new Date(listB.publishDate);
        return a.getTime() - b.getTime();
    }

    function viewsComparator(listA, listB) {
        if (!listA.isPublished) {
            return 1;
        }
        if (!listB.isPublished) {
            return -1;
        }
        return listB.views - listA.views;
    }

    function likesComparator(listA, listB) {
        if (!listA.isPublished) {
            return 1;
        }
        if (!listB.isPublished) {
            return -1;
        }
        return listB.likesList.length - listA.likesList.length;
    }

    function dislikesComparator(listA, listB) {
        if (!listA.isPublished) {
            return 1;
        }
        if (!listB.isPublished) {
            return -1;
        }
        return listB.dislikesList.length - listA.dislikesList.length;
    }

    store.newestSort = function () {
        store.idNamePairs.sort(newestPublishComparator);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_MODE,
            payload: {
                sort: "newest",
                pairs: store.idNamePairs}
        });
    }

    store.oldestSort = function () {
        store.idNamePairs.sort(oldestPublishComparator);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_MODE,
            payload: {
                sort: "oldest",
                pairs: store.idNamePairs}
        });
    }

    store.viewsSort = function () {
        store.idNamePairs.sort(viewsComparator);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_MODE,
            payload: {
                sort: "views",
                pairs: store.idNamePairs}
        });
    }

    store.likesSort = function () {
        store.idNamePairs.sort(likesComparator);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_MODE,
            payload: {
                sort: "likes",
                pairs: store.idNamePairs}
        });
    }

    store.dislikesSort = function () {
        store.idNamePairs.sort(dislikesComparator);
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_MODE,
            payload: {
                sort: "dislikes",
                pairs: store.idNamePairs}
        });
    }

    //FOR LIKING/DISLIKING LISTS
    store.unlikeList = function (top5List) {
        if (top5List.likesList.includes(auth.user.email)) {
            top5List.likesList.splice(top5List.likesList.indexOf(auth.user.email), 1);
        }
    }
    store.undislikeList = function (top5List) {
        if (top5List.dislikesList.includes(auth.user.email)) {
            top5List.dislikesList.splice(top5List.dislikesList.indexOf(auth.user.email), 1);
        }
    }
    store.likeList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            store.undislikeList(top5List);
            top5List.likesList[top5List.likesList.length] = auth.user.email;
            updateList(top5List);
        }
    }
    store.dislikeList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            store.unlikeList(top5List);
            top5List.dislikesList[top5List.dislikesList.length] = auth.user.email;
            updateList(top5List);
        }
    }

    async function updateList(top5List) {
        let response = await api.updateTop5ListByIdNoPerms(top5List._id, top5List);
        if (response.status === 200) {
            async function getListPairs() {
                response = await api.getTop5ListPairs();
                if (response.status === 200) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
            }
            getListPairs();
        }
    }

    async function updateListPerms(top5List) {
        let response = await api.updateTop5ListById(top5List._id, top5List);
        if (response.status === 200) {
            async function getListPairs() {
                response = await api.getTop5ListPairs();
                if (response.status === 200) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
            }
            getListPairs();
        }
    }

    store.addComment = async function (id, comment) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            top5List.comments[top5List.comments.length] = comment;
            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.status === 200) {
                async function getListPairs() {
                    if (store.filterMode === "your_lists") {
                        response = await api.getTop5ListPairs();
                    } else if (store.filterMode === "all_lists") {
                        response = await api.getPublishedTop5ListPairs();
                    } else if (store.filterMode === "community_lists") {
                        response = await api.getCommunityTop5ListPairs();
                    }
                    if (response.status === 200) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                            payload: pairsArray
                        });
                    }
                }
                getListPairs();
            }
        }
    }
    store.createNewCommunityList = async function (top5List) {
        console.log("CREATING COMMUNITY LIST");//scrap
        const response = await api.createTop5List(top5List.name, top5List.items, null);
        if (response.status === 201) {
            let newList = response.data.top5List;
            console.log(newList);
            newList.isCommunity = true;
            newList.isPublished = true;
            let d = new Date();
            let month = months[d.getMonth()];
            let day = d.getDate();
            let year = d.getFullYear();
            newList.publishDate = d;
            newList.publishDateString = month + " " + day + ", " + year;
            top5List.items.map((item, index) => (
                newList.communityItems[index] = {
                    item: top5List.items[index],
                    votes: (5 - index)
                }
            ));
            console.log("newlist");
            console.log(newList);
            updateListPerms(newList);
        }
    }

    store.updateCommunityList = async function (top5List) {
        let response = await api.getCommunityTop5ListPairs();
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            if (!pairsArray.length) {
                store.createNewCommunityList(top5List);
            }
            for (let i = 0; i < pairsArray.length; i++) {
                if (pairsArray[i].name === top5List.name) {//if names match
                    console.log("CREATING COMMUNITY LIST3");//scrap
                    let communityList = pairsArray[i];
                    let d = new Date();
                    let month = months[d.getMonth()];
                    let day = d.getDate();
                    let year = d.getFullYear();
                    communityList.publishDate = d;
                    communityList.publishDateString = month + " " + day + ", " + year;
                    //add points to each of the community items and sort
                    for (let x = 0; x < 5; x++) {
                        for (let j = 0; j < communityList.communityItems.length; j++) {
                            if (top5List.items[x] === communityList.communityItems[j].name) {
                                console.log("CREATING COMMUNITY LIST2");//scrap
                                communityList.communityItems[j].votes += (5 - x);
                            } else if (communityList.communityItems.length - 1 === j) {
                                //if item not in aggregate list
                                communityList.communityItems[communityList.communityItems.length] = {
                                    name: top5List.items[x],
                                    votes: (5 - x)
                                };
                            }
                        }
                    }
                } else if (i === pairsArray.length) {
                    //create new community list
                    store.createNewCommunityList(top5List);
                }
            }
            //handle if list isnt already in aggregate
        }
    }

    //FOR VIEWING LISTS
    store.viewYourLists = async function () {
        async function getYourListPairs() {
            let response = await api.getTop5ListPairs();
            if (response.status === 200) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_FILTER_MODE,
                    payload: {
                        pairs: pairsArray,
                        filterMode: "your_lists"
                    }
                });
            }
        }
        getYourListPairs();
    }
    store.viewAllLists = async function () {
        async function getAllListPairs() {
            let response = await api.getPublishedTop5ListPairs();
            if (response.status === 200) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.CHANGE_FILTER_MODE,
                    payload: {
                        pairs: pairsArray,
                        filterMode: "all_lists"
                    }
                });
            }
        }
        getAllListPairs();
    }
    store.searchListsByName = async function (text) {
        let response = null;
        if (store.filterMode === "your_lists") {
            response = await api.getTop5ListPairs();
        } else if (store.filterMode === "all_lists") {
            response = await api.getPublishedTop5ListPairs();
        } else {
            response = await api.getCommunityTop5ListPairs();
        }
        if (response.status === 200) {
            let allPairs = response.data.idNamePairs;
            let userPairs = []
            if (text === "") {
                userPairs = allPairs;
            } else {
                for (let i = 0; i < allPairs.length; i++) {
                    if (allPairs[i].name.toLowerCase().indexOf(text.toLowerCase()) === 0) {//USERNAME
                        userPairs[userPairs.length] = allPairs[i];
                    }
                }
            }
            storeReducer({
                type: GlobalStoreActionType.CHANGE_FILTER_TEXT,
                payload: {
                    text: text,
                    pairs: userPairs
                }
            });
        }
    }
    store.searchUserLists = async function (username) {
        let response = await api.getPublishedTop5ListPairs();
        if (response.status === 200) {
            let allPairs = response.data.idNamePairs;
            let userPairs = []
            if (username === "") {
                userPairs = allPairs;
            } else {
                for (let i = 0; i < allPairs.length; i++) {
                    if (allPairs[i].ownerEmail.toLowerCase() === username.toLowerCase()) {//USERNAME
                        userPairs[userPairs.length] = allPairs[i];
                    }
                }
            }
            storeReducer({
                type: GlobalStoreActionType.CHANGE_FILTER_TEXT,
                payload: {
                    text: username,
                    pairs: userPairs
                }
            });
        }
    }
    store.viewUserLists = async function () {
        let response = await api.getPublishedTop5ListPairs();
        if (response.status === 200) {
            let userPairs = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.CHANGE_FILTER_MODE,
                payload: {
                    pairs: userPairs,
                    filterMode: "user_lists"
                }
            });
        }
    }
    store.viewCommunityLists = async function () {
        let response = await api.getCommunityTop5ListPairs();
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.CHANGE_FILTER_MODE,
                payload: {
                    pairs: pairsArray,
                    filterMode: "community_lists"
                }
            });
        }
        console.log(store.filterMode);

    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        store.viewYourLists();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createTop5List(newListName, ["?", "?", "?", "?", "?"], auth.user.email);
        if (response.status === 201) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        const response = await api.getTop5ListPairs();
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: pairsArray
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }

    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.status === 200) {
            store.loadIdNamePairs();
            history.push("/");
        }
    }

    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;

            response = await api.updateTop5ListById(top5List._id, top5List);
            if (response.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: top5List
                });
                history.push("/top5list/" + top5List._id);
            }
        }
    }

    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };