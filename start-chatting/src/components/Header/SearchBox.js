import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import './SearchBox.css';

function SearchBox({ usersList, setSelectedUser }) {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const getSuggestions = (inputValue) => {
        const inputValueLowerCase = inputValue.trim().toLowerCase();
        const inputLength = inputValueLowerCase.length;

        return inputLength === 0
            ? []
            : usersList.filter(
                (user) =>
                    user.name.toLowerCase().slice(0, inputLength) === inputValueLowerCase
            );
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div className="suggestion">
            <div className="user-option">
                <img src={suggestion.profilePicture} alt={suggestion.name} className="user-image" />
                <div className="user-name">{suggestion.name}</div>
            </div>
        </div>
    );

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        setSelectedUser(suggestion);
        setValue('');
    };

    const inputProps = {
        placeholder: 'Search for a user...',
        value,
        onChange: (_, { newValue }) => setValue(newValue),
    };

    return (
        <div className="search-box-container">
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        </div>
    );
}

export default SearchBox;
