import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Input, InputAdornment } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    searchbar:{
        display: 'flex',
        height: '49px',
        width: '90%',
        padding: '6px 24px',
        gap: '12px',
        flexShrink: 0,
        alignSelf: 'stretch',
        borderRadius: '24px',
        border: '3px solid #E5E5E5',
        background: '#FFFFFF',
        alignItems: 'center',
      
    },
    placeholder: {
        color: '#AFAFAF',
        fontFamily: 'Nunito',
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 'normal',
        justifyContent:'flex-start',
    }
}));
function SearchBar(props) {
    const classes = useStyles();
    return (
   
        <FormControl className={classes.searchbar}>
            <Input
                id="outlined-start-adornment"
                placeholder={`Search ${props.placeholder}`}
                value={props.value}
                onChange={props.function}
                startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                disableUnderline
                fullWidth
            />
        </FormControl>
        
    );
    }
export default SearchBar;