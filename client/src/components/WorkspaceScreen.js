import { React, useContext, useState } from "react";
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import Box from '@mui/material/Box';
import SettingsToolbar from './SettingsToolbar.js'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");

    const handleSave = (event) =>{
        event.stopPropagation();
        store.updateCurrentList();
        store.closeCurrentList();
    }

    const handlePublish = (event) =>{
        event.stopPropagation();
        store.currentList.isPublished=true;
        store.updateCurrentList();
        store.closeCurrentList();
    }

    function handleUpdateText(event) {
        store.currentList.name=event.target.value;
        setText(event.target.value);
    }

    //cant publish if missing items or same name as another published list of the same user
    const canPublish = () =>{
        if(store.currentList.name===""){
            return true;
        }
        for (let i = 0; i < 5; i++) {
            if(store.currentList.items[i]===""){
                return false;
            }
        }
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if(store.idNamePairs[i].name===store.currentList.name&&store.currentList._id!==store.idNamePairs[i]._id&&store.idNamePairs[i].isPublished){
                return false;
            }
        }
        return true;
    }

    let editItems = "";
    if (store.currentList) {
        editItems =
            <List id="edit-items" sx={{ width: '100%', bgcolor: '#d4d4f5' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item
                            key={'top5-item-' + (index + 1)}
                            text={item}
                            index={index}
                        />
                    ))
                }
            </List>;
    }
    return (
        <Box id="top5-workspace" >
            <SettingsToolbar className="disable-top5-toolbar" />
            <Box id="workspace-edit">
                <Box
                    sx={{ p: 3 }}>
                        <TextField
                margin="normal"
                required
                id={"list-name"}
                label=""
                name="list-name"
                autoComplete="Top 5 List Item"
                onChange={handleUpdateText}
                defaultValue={store.currentList.name}
                inputProps={{style: {fontSize: '8pt'}}}
                InputLabelProps={{style: {fontSize: '8pt'}}}
                style = {{
                    backgroundColor: 'white',
                    height: "46px",
                    width: "600px"
                }}
            />
                    <Box id="workspace-items"
                        sx={{ fontSize: '35pt', p: 4, flexGrow: 1 }}>
                        <Grid container spacing={1}>
                            {
                                store.currentList.items.map((item, index) => (
                                    <Grid container spacing ={1}>   
                                        <Grid item xs={.75}
                                            className="item-numbers">
                                            <Typography
                                                noWrap
                                                component="div"
                                                display="inline"
                                                sx={{ fontSize: '35pt', p: 1.5 }}
                                            >
                                                {index + 1}.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={10}
                                            className="item-edit">
                                            <Top5Item
                                                key={'top5-item-' + (index + 1)}
                                                text={item}
                                                index={index}
                                            />

                                        </Grid>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>

                </Box>
                <Button variant = "outlined" className = "workspace-button"
                onClick = {handleSave}>Save</Button>
                <Button disabled = {!canPublish()} variant = "outlined" className = "workspace-button"
                onClick = {handlePublish}>Publish</Button>
            </Box>
        </Box>
    )
}

export default WorkspaceScreen;