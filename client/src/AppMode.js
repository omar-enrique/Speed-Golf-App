const AppMode = {
    LOGIN: "LoginMode",
    TABLE: "TableMode",
    ADD_DATA: "AddDataMode",
    EDIT_DATA: "EditDataMode"
};

Object.freeze(AppMode); //This ensures that the object is immutable.
export default AppMode;