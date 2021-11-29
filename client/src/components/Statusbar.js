import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
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
        if (store.currentList) {
            text = store.currentList.name;
            return (
                <div id="top5-statusbar">
                    <Typography variant="h4">{text}</Typography>
                </div>
            );
        } else {
            return (<div id="top5-statusbar">
                <AddIcon style={{ fontSize: '50pt' }}/>
                <Typography variant="h4">Your Lists</Typography>
            </div>);
        }
    } else {
        return null;
    }
}

export default Statusbar;