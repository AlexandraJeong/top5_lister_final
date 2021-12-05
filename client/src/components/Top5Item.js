import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");
    let { index } = props;

    function handleUpdateText(event) {
        store.currentList.items[index]=event.target.value;
        setText(event.target.value);
    }
        let cardElement =    
            <TextField
            margin="normal"
            required
            fullWidth
            id={"item-" + (index+1)}
            label=""
            name="item"
            autoComplete="Top 5 List Item"
            onChange={handleUpdateText}
            defaultValue={props.text}
            inputProps={{style: {fontSize: '35pt'}}}
            InputLabelProps={{style: {fontSize: '35pt'}}}
            style = {{
                height: "100px"
            }}
            />
    return (
        cardElement
    );
}

export default Top5Item;