import React from 'react';
import { Input } from 'semantic-ui-react'

const Input = ({ label, text, type, id, value, handleChange }) => (
    <>
        <Input action='Lägg till adress' placeholder='url' />

    <label htmlFor={label}>{text}</label>
        <input
            type={type}
            className="form-control"
            id={id}
            value={value}
            onChange={handleChange}
            required
        />
    </>
);

export default Input;