import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const {idNamePair, selected } = props;

    console.log("Views");
    console.log(idNamePair.views);
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

    
    let cardElement =
        <ListItem
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
                    sx={{ fontSize: '15pt'}}
                >
                    {idNamePair.likesList.length}
                </Typography>
                <Typography                        
                        noWrap
                        component="div"
                        sx={{ fontSize: 10, display: { xs: 'none', sm: 'block' } }}                        
                    >
                        Views: {idNamePair.views}
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
                    sx={{ fontSize: '15pt'}}
                >
                    {idNamePair.dislikesList.length}
                </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton 
                disabled={store.filterMode != "your_lists"}
                onClick={(event) => {
                    handleDeleteList(event, idNamePair._id)
                }} aria-label='delete'>
                    <DeleteIcon 
                    className = {store.filterMode === "your_lists"? "delete":"delete-disabled"}
                    style={{ fontSize: '20pt' }} />
                </IconButton>
                <Box>
                <IconButton aria-label='expand' onClick={handleExpandList}>
                    <ExpandMoreIcon style={{ fontSize: '20pt' }} />
                </IconButton>
                </Box>
            </Box>
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
                    sx={{ fontSize: '15pt'}}
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
                    sx={{ fontSize: '15pt'}}
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

            <List sx={{ width: '90%', left: '5%', bgcolor: '#2c2f70'}}>
                {
                    idNamePair.items.map((item, index) => (
                        <ListItem>
                        {(index+1)}. {item}
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