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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Grid from '@mui/material/Grid';

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
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
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
        setIsOpen(true);
    }

    function handleUnexpandList(event) {
        event.stopPropagation();
        setIsOpen(false);
    }

    //CHECKING LIKES/DISLIKES
    function doesUserLikeList() {
        return idNamePair.likesList.includes(auth.user.email);
    }
    function doesUserDislikeList() {
        return idNamePair.dislikesList.includes(auth.user.email);
    }

    //LIKE/DISLIKE HANDLERS
    function likeListHandler(event) {
        event.stopPropagation();
        store.likeList(idNamePair._id);
    }
    function dislikeListHandler(event) {
        event.stopPropagation();
        store.dislikeList(idNamePair._id);
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            className={'list-card'}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%'}}
        >
            <Grid container spacing={2}>
                <Grid item xs={9}>
                <Typography
                            style ={{marginLeft: '15px'}}
                            noWrap
                            component="div"
                            display="inline"
                            sx={{ fontSize: '20pt' }}
                        >
                            {idNamePair.name}
                        </Typography>
                </Grid>
                <Grid item xs={1}>
                        <IconButton aria-label='like'
                            disabled={doesUserLikeList()}
                            onClick={likeListHandler}>
                            {doesUserLikeList() ? <ThumbUpIcon style={{ fontSize: '20pt' }} /> : <ThumbUpOutlinedIcon style={{ fontSize: '20pt' }} />}
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
                            disabled={doesUserDislikeList()}
                            onClick={dislikeListHandler}>
                            {doesUserDislikeList() ? <ThumbDownIcon style={{ fontSize: '20pt' }} /> : <ThumbDownOutlinedIcon style={{ fontSize: '20pt' }} />}
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
                                style={{ fontSize: '20pt' }} />
                        </IconButton>
                </Grid>
                <Grid item xs={9}>
                </Grid>
                <Grid item xs={1}>
                        <Typography
                            noWrap
                            component="div"
                            sx={{ fontSize: 10, display: { xs: 'none', sm: 'block' } }}
                        >
                            Views: {idNamePair.views}
                        </Typography>
                </Grid>
                <Grid item xs={.2}></Grid>
                <Grid item xs={1}></Grid>
                <Box >
                    <IconButton aria-label='expand' onClick={handleExpandList}>
                        <ExpandMoreIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
            </Grid>



        </ListItem>

    if (isOpen) {
        console.log("just got list");
        cardElement = <ListItem
            id={idNamePair._id}
            className={'list-card'}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '48pt' }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='like'>
                    <ThumbUpOutlinedIcon style={{ fontSize: '20pt' }} />
                </IconButton>
                <Typography
                    noWrap
                    component="div"
                    display="inline"
                    sx={{ fontSize: '15pt' }}
                >
                    Number
                </Typography>
                <Typography
                    noWrap
                    component="div"
                    sx={{ fontSize: 10, display: { xs: 'none', sm: 'block' } }}
                >
                    Views:
                </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='dislike'>
                    <ThumbDownOutlinedIcon style={{ fontSize: '20pt' }} />
                </IconButton>
                <Typography
                    noWrap
                    component="div"
                    display="inline"
                    sx={{ fontSize: '15pt' }}
                >
                    Number
                </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                    <DeleteIcon style={{ fontSize: '20pt' }} />
                </IconButton>
                <Box>
                    <IconButton aria-label='expand' onClick={handleUnexpandList}>
                        <ExpandLessIcon style={{ fontSize: '20pt' }} />
                    </IconButton>
                </Box>
            </Box>

            <List sx={{ width: '90%', left: '5%', bgcolor: '#2c2f70' }}>
                {
                    idNamePair.items.map((item, index) => (
                        <ListItem>
                            {(index + 1)}. {item}
                        </ListItem>
                    ))
                }
            </List>
        </ListItem>
    }
    return (
        cardElement
    );
}

export default ListCard;