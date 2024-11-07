import React from 'react';
import * as PropTypes from "prop-types";
import {ITeacher} from "../models/interfaces.ts";

Form.propTypes = {
    item: PropTypes.object
}

interface IForm {
    item?: ITeacher
}

function Form({item}: IForm) {
    return (
        <div></div>
    );
}

export default Form;