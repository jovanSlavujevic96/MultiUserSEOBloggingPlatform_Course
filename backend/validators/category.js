import {check} from 'express-validator';

const categoryCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
];

export { categoryCreateValidator };
