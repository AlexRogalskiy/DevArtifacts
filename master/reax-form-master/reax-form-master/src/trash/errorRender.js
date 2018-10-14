import { map } from 'lodash-es';

export default ({ validations, pristine, blurred, submitTried }) => {
    const show = blurred || submitTried;
    const errors = map(validations, (value, key) => !value ? key : null).filter(value => value).join(', ');
    return show ? errors : null;
};