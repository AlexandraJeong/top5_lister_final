import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AuthContext from '../auth';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text = "";
    if (auth.user) {
        if(store.filterMode==="user_lists"){
            if(store.filterText!=""){
                return (
                    <div id="top5-statusbar">
                        <Typography variant="h4">{store.filterText}'s Lists</Typography>
                    </div>
                );
            }else{
                return (
                    <div id="top5-statusbar">
                        <Typography variant="h4">All Users' Lists</Typography>
                    </div>
                ); 
            }
        }else if(store.filterMode==="your_lists"){
            return (<div id="top5-statusbar">
                <IconButton aria-label='createList' onClick = {handleCreateNewList}>
                <AddIcon style={{ fontSize: '50pt' }}/>
                </IconButton>
                <Typography variant="h4">Your Lists</Typography>
            </div>);
        }else if(store.filterText!=""){
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">{store.filterText} Lists</Typography>
                </div>
            );
        }else if(store.filterMode==="community_lists"){
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">Community Lists</Typography>
                </div>
            );
        }else{
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">Published Lists</Typography>
                </div>
            );
        }
    } else {
        return null;
    }
}

export default Statusbar;