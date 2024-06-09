import React from 'react';

const SearchBar = ({ query, handleInputChange, handleSearch, handleCancelSearch, toggleSearchType, searchType }) => (
    <div className='d-flex flex-column'>
        <button onClick={toggleSearchType} className='switch'>
            {searchType === 'track' ? 'Song' : 'Artist'}
            <i className="bi bi-arrow-left-right ms-3"></i>
        </button>
        <div className='d-flex flex-row justify-content-center align-items-center'>
            <input className='flex-grow-1' type="text" value={query} onChange={handleInputChange} />
            <button className='search-btn rounded-circle' onClick={handleCancelSearch}><i className="bi bi-x"></i></button>
            <button className='search-btn rounded-circle' onClick={handleSearch}><i className="bi bi-search"></i></button>
        </div>

    </div>
);

export default SearchBar;
