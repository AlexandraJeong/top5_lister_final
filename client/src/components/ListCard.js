import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import { getAutoHeightDuration } from '@mui/material/styles/createTransitions';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = idNamePair._id

            // CHANGE THE CURRENT LIST
            store.setCurrentList(_id);
        }
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleExpandList(event) {
        event.stopPropagation();
        if(idNamePair.isPublished){
            store.incrementViews(idNamePair._id);
        }
        setIsOpen(true);
    }

    function handleUnexpandList(event) {
        event.stopPropagation();
        setIsOpen(false);
    }

    //CHECKING LIKES/DISLIKES
    function doesUserLikeList() {
        if(!auth.isGuest){
            return idNamePair.likesList.includes(auth.user.email);
        }else{
            return false;
        }
    }
    function doesUserDislikeList() {
        if(!auth.isGuest){
            return idNamePair.dislikesList.includes(auth.user.email);
        }else{
            return false;
        }

    }

    //LIKE/DISLIKE HANDLERS
    function likeListHandler(event) {
        event.stopPropagation();
        store.likeList(idNamePair._id, doesUserLikeList());
    }
    function dislikeListHandler(event) {
        event.stopPropagation();
        store.dislikeList(idNamePair._id, doesUserDislikeList());
    }

    //CREATING COMMENTS
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let comment = {
                user: auth.user.email,
                content: text
            };
            store.addComment(idNamePair._id,comment);
            setText("");
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let items =
    <Stack width = "100%" direction="row" spacing = {2}>
        <List className = "expanded-info" sx={{ width: '45%', left: '2.5%', bgcolor: '#2c2f70' }}>
            {
                idNamePair.items.map((item, index) => (
                    <Box>
                    {idNamePair.isCommunity?
                    <ListItem>
                        <Typography fontSize="25px">
                        {(index + 1)}. {idNamePair.communityItems[index].name}
                        </Typography> 
                        <Typography fontSize="15px">
                        ({idNamePair.communityItems[index].votes} Votes)
                        </Typography>
                    </ListItem>:
                    <ListItem>
                        <Typography fontSize="33px">
                        {(index + 1)}. {item}
                        </Typography> 
                    </ListItem>}
                    </Box>
                ))
            }
        </List>
        {idNamePair.isPublished?<List className = "comment-box" sx={{ width: '50%', left: '2.5%', p: 0}}>
            <Box sx={{ height: "300px", overflowY: "scroll"}}>
            {
                idNamePair.comments.map((comment, index) => (
                    <ListItem className = "comments">
                        <Typography fontSize="25px">
                        {comment.user}<br/>{comment.content}
                        </Typography>
                    </ListItem>
                ))
            }
            </Box>
            {auth.isGuest? null: <TextField style = {{
                    backgroundColor: 'white',
                    width: "100%",
                    borderRadius: "15px"
                }}
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                value = {text}/>}  
        </List>:null}
    </Stack>
    let cardElement =
        <ListItem
            id={idNamePair._id}
            className={idNamePair.isPublished?'list-card':'list-card-unpublished'}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%' }}
        >
            <Stack width="100%">
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Typography
                        style={{ marginLeft: '15px' }}
                        noWrap
                        component="div"
                        display="inline"
                        sx={{ fontSize: '20pt', fontWeight: 'bold' }}
                    >
                        {idNamePair.name}<br />
                        {!idNamePair.isCommunity?
                        <Typography
                            style={{ marginLeft: '15px' }}
                            noWrap
                            component="div"
                            display="inline"
                            sx={{ fontSize: '15pt' }}
                        >
                            By:   {idNamePair.ownerEmail}
                        </Typography>:null}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton aria-label='like'
                        disabled={auth.isGuest||!idNamePair.isPublished}
                        onClick={likeListHandler}>
                        {doesUserLikeList() ? <ThumbUpIcon style={{ fontSize: '30pt' }} /> : <ThumbUpOutlinedIcon style={{ fontSize: '30pt' }} />}
                    </IconButton>
                    <Typography
                        noWrap
                        component="div"
                        display="inline"
                        sx={{ fontSize: '15pt' }}
                    >
                        {idNamePair.likesList.length}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton aria-label='dislike'
                        disabled={auth.isGuest||!idNamePair.isPublished}
                        onClick={dislikeListHandler}>
                        {doesUserDislikeList() ? <ThumbDownIcon style={{ fontSize: '30pt' }} /> : <ThumbDownOutlinedIcon style={{ fontSize: '30pt' }} />}
                    </IconButton>
                    <Typography
                        noWrap
                        component="div"
                        display="inline"
                        sx={{ fontSize: '15pt' }}
                    >
                        {idNamePair.dislikesList.length}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        disabled={store.filterMode != "your_lists"}
                        onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} aria-label='delete'>
                        <DeleteIcon
                            className={store.filterMode === "your_lists" ? "delete" : "delete-disabled"}
                            style={{ fontSize: '30pt' }} />
                    </IconButton>
                </Grid>
                {isOpen ? items : null}
                <Grid item xs={9}>
                    <Typography
                        noWrap
                        style={{ marginLeft: '15px' }}
                        component="div"
                        sx={{ fontSize: 15, display: { xs: 'none', sm: 'block' } }}
                    >
                        {!idNamePair.isPublished ? <Link to="/" onClick={handleLoadList}>Edit</Link> : 
                        !idNamePair.isCommunity? "Published: " + idNamePair.publishDateString: "Updated: "+idNamePair.publishDateString}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography
                        noWrap
                        component="div"
                        sx={{ fontSize: 15, display: { xs: 'none', sm: 'block' } }}
                    >
                        Views:
                        <Typography
                            noWrap
                            component="div"
                            display="inline"
                            sx={{ color: "red" }}
                        >
                            {idNamePair.views}
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item xs={.2}></Grid>
                <Grid item xs={1}></Grid>
                <Box >
                    {isOpen ?
                        <IconButton aria-label='expandLess' onClick={handleUnexpandList}>
                            <ExpandLessIcon style={{ fontSize: '30pt' }} />
                        </IconButton> :
                        <IconButton aria-label='expand' onClick={handleExpandList}>
                            <ExpandMoreIcon style={{ fontSize: '30pt' }} />
                        </IconButton>
                    }
                </Box>
            </Grid>
            </Stack>
        </ListItem>

    return (
        cardElement
    );
}

export default ListCard;