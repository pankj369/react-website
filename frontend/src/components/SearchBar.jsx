import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    return (
        <div className="search-bar">
            <InputGroup>
                <InputGroup.Text>
                    <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                    placeholder="Search books by title, author, or category..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </InputGroup>
        </div>
    );
};

export default SearchBar;