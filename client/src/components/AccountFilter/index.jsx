import React, { useEffect, useState } from "react";
import { Box, makeStyles, Button, Typography, List } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NameCard from "../NameCard/NameCard";

const useStyles = makeStyles((theme) => ({
  tabs: {
    border: "none",
    borderTop: "none",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    boxShadow: "none",
    transition: "none",
    borderRadius: "none",
  },
  paginationContainer: {
    margin: "auto",
    padding: "1rem",
  },
}));

const AccountFilter = (props) => {
  const {
    filteredDocuments,
    type,
    handleDocument,
    handleSelect,
    primary,
    page,
    setPage,
    icon
  } = props;
  const classes = useStyles();
  const MAX_ITEMS = 10;
  // State for Account Interface
  const [accountsToDisplay, setAccountsToDisplay] = useState("Admin");
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const filterAccounts = (userType) => {
    return filteredDocuments.filter(
      (document) => type(document) == `(${userType})`
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);

    // if (MAX_ITEMS * value >= filteredAccounts.length)
    //   setViewableAccounts(filteredAccounts.slice((value - 1) * MAX_ITEMS));
    // else
    //   setViewableAccounts(
    //     filteredAccounts.slice((value - 1) * MAX_ITEMS, value * MAX_ITEMS)
    //   );
  };

  useEffect(() => {
    const accounts = filterAccounts(accountsToDisplay)
    setFilteredAccounts(accounts)
  }, [accountsToDisplay, filteredDocuments]);

  return (
    <Box>
      {/* Tabs to filter user accounts */}
      <Box style={{ display: "flex", gap: 50 }}>
        {["Admin", "Teacher", "Student"].map((item) => (
          <Button
            onClick={() => {
              setAccountsToDisplay(item);
              setPage(1);
            }}
            disableRipple={true}
            className={classes.tabs}
          >
            <Typography
              variant="h2"
              style={
                accountsToDisplay === item
                  ? { textDecoration: "underline" }
                  : null
              }
            >
              {item}s
            </Typography>
          </Button>
        ))}
      </Box>
      {/* Display the filtered accounts */}
      <Box>
        {filteredAccounts.length > 0
          ? filteredAccounts.slice((page - 1) * MAX_ITEMS, MAX_ITEMS * page).map((document) => {
              return (
                type(document) == `(${accountsToDisplay})` && (
                  <List className={classes.list}>
                    <NameCard
                      handleDocument={handleDocument}
                      handleSelect={handleSelect}
                      document={document}
                      isAdmin={false}
                      name={primary(document)}
                    />
                  </List>
                )
              );
            })
          : (
            <div style={{ display: "flex", marginTop: "2rem" }}>
                <div style={{ margin: "auto", padding: "3rem" }}>
                  <Typography
                    className="flow-text"
                    style={{ color: "grey" }}
                    variant="h5"
                  >
                    No {accountsToDisplay}s were found.
                  </Typography>
                  <p style={{ textAlign: "center", color: "grey" }}>
                    <FontAwesomeIcon icon={icon} size="5x" />
                  </p>
                </div>
              </div>
          )}
      </Box>
      {/* Pagination Feature - navigate pages of users */}
      <div style={{ display: "flex" }}>
        <div className={classes.paginationContainer}>
          <Pagination
            size="small"
            color={"primary"}
            count={Math.ceil(filteredAccounts.length / MAX_ITEMS)}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </Box>
  );
};

export default AccountFilter;
