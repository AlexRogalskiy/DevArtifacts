import { connect } from "react-redux";

const resetButton = ({ dispatch }) => {
    return (
        <Button label="Reset" onPress={dispatch}/>
    )
};

connect()(resetButton);

export default resetButton;