import React, { useState, useMemo } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "./FilterComponent";


const DataTableCol = props => {

    const [filterText, setFilterText] = useState("");

    console.log(props.columns);

    // filtre data
    const filteredItems = props.data.filter(
        item =>
        JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
    );

    // hidden pagination && clear text filter
    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return ( <
            FilterComponent onFilter = { event => setFilterText(event.target.value) }
            onClear = { handleClear }
            filterText = { filterText }
            />
        );
    }, [filterText, resetPaginationToggle]);

    return ( <
        DataTable title = { props.title }
        columns = { props.columns }
        data = { filteredItems }
        defaultSortField = { props.data.nom }
        striped pagination subHeader subHeaderComponent = { subHeaderComponent }
        />
    );
};

export default DataTableCol;