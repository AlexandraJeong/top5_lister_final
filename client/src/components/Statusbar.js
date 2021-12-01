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
            //text = store.currentList.name;
            //return (
            //    <div id="top5-statusbar">
            //        <Typography variant="h4">{text}</Typography>
            //    </div>
            //);
            return (<div id="top5-statusbar">
                <IconButton aria-label='createList' onClick = {handleCreateNewList}>
                <AddIcon style={{ fontSize: '50pt' }}/>
                </IconButton>
                <Typography variant="h4">Your Lists</Typography>
            </div>);
    } else {
        return null;
    }
}

export default Statusbar;