import { useContext, useState } from 'react';
import AuthContext from '../auth';
import InputBase from '@mui/material/InputBase';
import { GlobalStoreContext } from '../store'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FunctionsIcon from '@mui/icons-material/Functions';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Toolbar(){
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [text, setText] = useState("");

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if(store.filterMode==="user_lists"){
                store.searchUserLists(text);
            }else{
                store.searchListsByName(text);
            }
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    //SORTING MENU FUNCTIONS
    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleNewestPublish = () =>{
        handleMenuClose();
        store.newestSort();
    }

    const handleOldestPublish = () =>{
        handleMenuClose();
        store.oldestSort();
    }

    const handleViewsSort = () =>{
        handleMenuClose();
        store.viewsSort();
    }

    const handleLikesSort = () =>{
        handleMenuClose();
        store.likesSort();
    }

    const handleDislikesSort = () =>{
        handleMenuClose();
        store.dislikesSort();
    }
    const SortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={"sort-menu"}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleNewestPublish}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={handleOldestPublish}>Publish Date (Oldest)</MenuItem>
            <MenuItem onClick={handleViewsSort}>Views</MenuItem>
            <MenuItem onClick={handleLikesSort}>Likes</MenuItem>
            <MenuItem onClick={handleDislikesSort}>Dislikes</MenuItem>
        </Menu>
    );

    //LIST VIEWING OPTIONS FUNCTIONS
    const handleViewYourLists = (event) =>{
        event.stopPropagation();
        store.viewYourLists();
    }
    const handleViewAllLists = (event) =>{
        event.stopPropagation();
        store.viewAllLists();
    }
    const handleViewUserLists = (event) =>{
        event.stopPropagation();
        store.viewUserLists("");
    }
    const handleViewCommunityLists = (event) =>{
        event.stopPropagation();
        store.viewCommunityLists();
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar id = "top5-toolbar" position="static">
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='your-lists' 
                disabled={store.filterMode==="your_lists"}
                onClick={handleViewYourLists}
                disabled = {auth.isGuest}>
                        <HomeOutlinedIcon 
                        className = {store.filterMode === "your_lists"? "filter-button-selected" : "filter-button"}
                        style={{ fontSize: '40pt' }} />
                </IconButton>
                <IconButton aria-label='all-lists' 
                disabled={store.filterMode==="all_lists"}
                onClick={handleViewAllLists}>
                    <GroupsOutlinedIcon 
                    className = {store.filterMode === "all_lists"? "filter-button-selected" : "filter-button"}
                    style={{ fontSize: '40pt' }} />
                </IconButton>
                <IconButton aria-label='user-lists' 
                disabled={store.filterMode==="user_lists"}
                onClick={handleViewUserLists}>
                    <PersonOutlineOutlinedIcon 
                    className = {store.filterMode === "user_lists"? "filter-button-selected" : "filter-button"}
                    style={{ fontSize: '40pt' }} />
                </IconButton>
                <IconButton aria-label='community-lists' 
                disabled={store.filterMode==="community_lists"}
                onClick={handleViewCommunityLists}>
                    <FunctionsIcon 
                    className = {store.filterMode === "community_lists"? "filter-button-selected" : "filter-button"}
                    style={{ fontSize: '40pt' }} />
                </IconButton>
                <TextField
                    onKeyPress={handleKeyPress}
                    onChange={handleUpdateText}
                    placeholder={"Search"}
                    style={{ width: 600 }}
                    className='search'
                    inputProps={{ style: { fontSize: 18, backgroundColor: 'white'} }}
                    InputLabelProps={{ style: { fontSize: 18 } }}
                />
                <Typography                        
                        noWrap
                        component="div"
                        display = "inline"
                        sx={{ fontSize: 20, color: "black "}}                        
                    >
                        SORT BY
                </Typography>
                <IconButton aria-label='filter-lists' onClick = {handleSortMenuOpen}>
                    <FilterListIcon style={{ fontSize: '40pt' }} />
                </IconButton>
            </Box>
            </AppBar>
            {
            SortMenu
            }
        </Box>
    );
}